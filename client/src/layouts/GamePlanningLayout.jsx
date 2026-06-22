import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, ListGroup, ListGroupItem, Container } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';
import GameContext from "../contexts/GameContext.js";
import FeedbackContext from "../contexts/FeedbackContext.js";
import { MetroMap } from '../components/MetroMap.jsx';
import { getEndpoints, executeRoute } from '../api/games-api.js'
import { MAX_GAME_DURATION } from "../config/config.js"

export function GamePlanningLayout(props) {
    const { lines, segments, stations, stationIdToIndex, lineIdToIndex } = useContext(GameContext);
    const { setFeedbackFromError } = useContext(FeedbackContext);
    const [route, setRoute] = useState([]);
    const [endpoints, setEndpoints] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getEndpoints().then(response => {
            setEndpoints(response);
        }).catch(e => {
            setEndpoints(null);
            setFeedbackFromError(e);
        })
    }, [])

    if (!lines.length || !segments.length || !stations.length || !endpoints) {
        return (
            <>
                <h3>Loading...</h3>
            </>
        );
    }

    const displaySegments = segments.map(segment => {
        const fromStationIndex = stationIdToIndex[segment.from_station_id];
        const fromStationName = stations[fromStationIndex].name;
        const toStationIndex = stationIdToIndex[segment.to_station_id];
        const toStationName = stations[toStationIndex].name;
        const lineIndex = lineIdToIndex[segment.line_id];
        const lineName = lines[lineIndex].name;
        return {
            "id": getIdFromSegment(segment),
            "fromStationName": fromStationName,
            "toStationName": toStationName,
            "lineName": lineName
        };
    })

    const segmentIdToIndex = {};
    segments.forEach((segment, index) => {
        segmentIdToIndex[getIdFromSegment(segment)] = index;
    })

    const departureStationName = stations[stationIdToIndex[endpoints.departure_station_id]].name;
    const arrivalStationName = stations[stationIdToIndex[endpoints.arrival_station_id]].name;

    const handlePlanningFinished = async () => {
        try {
            const response = await executeRoute(route);
            const appliedEvents = response.appliedEvents;
            const score = response.score;
            navigate('/game/execution', { state: { route, appliedEvents, score } });
        } catch (err) {
            props.setShouldRefresh(true);
            navigate('/game/result', { state: { err, score: 0 } });
        }

    };

    const handleSegmentSelection = (id) => {
        const segmentIndex = segmentIdToIndex[id];
        setRoute(prevRoute => [...prevRoute, segments[segmentIndex]]);
    };

    const handleSegmentDeselection = (id) => {
        setRoute(prevRoute => prevRoute.filter(segment => {
            return getIdFromSegment(segment) !== id;
        }));
    };

    return (
        <>
            <Container>
                <MetroMap lines={[]}
                    segments={[]}
                    stations={stations}
                    stationIdToIndex={stationIdToIndex}
                    lineIdToIndex={lineIdToIndex} />
                <Row>
                    <Col>
                        You have to try to connect {departureStationName} to {arrivalStationName}
                    </Col>
                    <Col>
                        in
                    </Col>
                    <Col>
                        <Countdown handlePlanningFinished={handlePlanningFinished} />
                    </Col>
                </Row>
                <SegmentList segments={displaySegments}
                    handleSegmentSelection={handleSegmentSelection}
                    handleSegmentDeselection={handleSegmentDeselection}
                    route={route}
                />
                <Button onClick={() => handlePlanningFinished()}>Go next phase</Button>
            </Container>
        </>
    );
}

function SegmentList(props) {
    const segments = props.segments;
    return (
        <ListGroup id="segments-list" variant="flush">
            <ListGroupItem>
                <Row>
                    <Col>
                        From
                    </Col>
                    <Col>
                        To
                    </Col>
                    <Col>
                        Line
                    </Col>
                    <Col>
                        Status
                    </Col>
                    <Col>
                        Order
                    </Col>
                </Row>
            </ListGroupItem>
            {segments.map((segment) => <SegmentInList
                key={segment.id}
                id={segment.id}
                segment={segment}
                handleSegmentSelection={props.handleSegmentSelection}
                handleSegmentDeselection={props.handleSegmentDeselection}
                route={props.route}
            />)}
        </ListGroup>
    );
}

function SegmentInList(props) {
    const segment = props.segment;
    const order = props.route.findIndex(segment => {
        return getIdFromSegment(segment) === props.id;
    });
    const selected = order >= 0 ? true : false;

    return (
        <>
            <ListGroupItem>
                <Row>
                    <Col>
                        {segment.fromStationName}
                    </Col>
                    <Col>
                        {segment.toStationName}
                    </Col>
                    <Col>
                        {segment.lineName}
                    </Col>
                    <Col>
                        {selected ?
                            <Button variant="danger" onClick={() => props.handleSegmentDeselection(props.id)}>Deselect</Button> :
                            <Button variant="success" onClick={() => props.handleSegmentSelection(props.id)}>Select</Button>
                        }
                    </Col>
                    <Col>
                        {selected && <span>Stop #{order + 1}</span>}
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}

function Countdown(props) {
    const [seconds, setSeconds] = useState(MAX_GAME_DURATION);

    useEffect(() => {
        const timerId = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds <= 1) {
                    props.handlePlanningFinished();
                    clearInterval(timerId);
                    return 0;
                } else {
                    return prevSeconds - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [])

    return (
        <>
            {seconds} seconds
        </>
    );
}

function getIdFromSegment(segment) {
    return [segment.from_station_id, segment.to_station_id, segment.line_id].join("-");
}