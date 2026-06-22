import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";
import { executeRoute } from '../api/games-api.js'

export function GameExecutionLayout(props) {
    const { lines, stations, stationIdToIndex, lineIdToIndex, route } = useContext(GameContext);
    const navigate = useNavigate();
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [score, setScore] = useState(-1);

    if (!lines.length || !stations.length) {
        return (
            <>
                <h3>Loading...</h3>
            </>
        );
    }

    const handleExecution = async () => {
        try {
            const response = await executeRoute(route);
            setAppliedEvents(response.appliedEvents);
            setScore(response.score);
        } catch (err) {
            setAppliedEvents([]);
            setScore(-1);
            navigate('/game/result', { state: { err, score: 0 } });
        }
    };

    if (!route.length || !appliedEvents.length || score < 0) {
        return (
            <>  
                Do you really want to find out the result? (In any case, you only have that option <i className="bi bi-emoji-wink"></i>)
                <Button onClick={() => handleExecution()}>Yes</Button>
            </>
        );
    }

    return (
        <>
            <ViewStep lines={lines}
                stations={stations}
                stationIdToIndex={stationIdToIndex}
                lineIdToIndex={lineIdToIndex}
                appliedEvents={appliedEvents}
                score={score}
                route={route}
            />
        </>
    );
}

function ViewStep(props) {
    const [segmentIndex, setSegmentIndex] = useState(0);
    const navigate = useNavigate();

    const route = props.route;
    const segment = route[segmentIndex];
    const event = props.appliedEvents[segmentIndex];

    const fromStationIndex = props.stationIdToIndex[segment.from_station_id];
    const fromStationName = props.stations[fromStationIndex].name;
    const toStationIndex = props.stationIdToIndex[segment.to_station_id];
    const toStationName = props.stations[toStationIndex].name;
    const lineIndex = props.lineIdToIndex[segment.line_id];
    const lineName = props.lines[lineIndex].name;

    const handleNextStep = () => {
        if (segmentIndex === route.length - 1) {
            navigate("/game/result", { state: { score: props.score } });
        } else {
            setSegmentIndex(prevSegmentIndex => prevSegmentIndex + 1);
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {fromStationName}
                    </Col>
                    <Col>
                        {toStationName}
                    </Col>
                    <Col>
                        {lineName}
                    </Col>
                    <Col>
                        {event.description}
                    </Col>
                    <Col>
                        <Button onClick={() => handleNextStep()}>
                            {segmentIndex == route.length - 1 ? <span>Find out the result</span> : <span>Next event</span>}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}