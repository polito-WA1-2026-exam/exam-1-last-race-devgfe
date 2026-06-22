import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";

export function GameExecutionLayout(props) {
    const { lines, stations, stationIdToIndex, lineIdToIndex } = useContext(GameContext);
    const { state } = useLocation();

    if (!lines.length || !stations.length || !state) {
        return (
            <>
                <h3>Loading...</h3>
            </>
        );
    }

    const appliedEvents = state.appliedEvents;
    const score = state.score;
    const route = state.route;

    return (
        <>
            <ViewStep lines={lines}
                stations={stations}
                stationIdToIndex={stationIdToIndex}
                lineIdToIndex={lineIdToIndex}
                appliedEvents={appliedEvents}
                score={score}
                route={route}
                setShouldRefresh={props.setShouldRefresh}
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
            props.setShouldRefresh(true);
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