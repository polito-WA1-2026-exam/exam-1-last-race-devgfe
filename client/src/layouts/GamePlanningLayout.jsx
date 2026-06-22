import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, ListGroup, ListGroupItem, Container, Spinner, Card, Alert, Badge } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';
import GameContext from "../contexts/GameContext.js";
import FeedbackContext from "../contexts/FeedbackContext.js";
import { MetroMap } from '../components/MetroMap.jsx';
import { getEndpoints } from '../api/games-api.js';
import { MAX_GAME_DURATION } from "../config/config.js";

export function GamePlanningLayout(props) {
    const { lines, segments, stations, stationIdToIndex, lineIdToIndex, route, endpoints } = useContext(GameContext);
    const { setFeedbackFromError } = useContext(FeedbackContext);
    const navigate = useNavigate();

    if (!lines.length || !segments.length || !stations.length) {
        return (
            <>
                <Container className="d-flex flex-column justify-content-center align-items-center py-5 mt-5">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="mt-4 text-muted fw-medium">Preparing the challenge...</h4>
                </Container>
            </>
        );
    }

    const handleEndpoints = async () => {
        try {
            const response = await getEndpoints();
            props.setEndpoints(response);
        } catch (err) {
            props.setEndpoints(null);
            setFeedbackFromError(err);
        }
    };

    if (!endpoints) {
        return (
            <>
                <Container className="d-flex justify-content-center align-items-center py-5 mt-5 flex-grow-1">
                    <Card className="shadow-lg border-0 rounded-4 text-center p-4" style={{ maxWidth: '500px' }}>
                        <Card.Body>
                            <i className="bi bi-stopwatch text-primary mb-3 d-block" style={{ fontSize: '4rem' }}></i>
                            <h2 className="fw-bold mb-3">Ready to Start?</h2>
                            <p className="text-muted fs-5 mb-4">
                                Once you begin, you will have exactly <strong>{MAX_GAME_DURATION} seconds</strong> to build your route from memory.
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Button variant="outline-secondary" size="lg" className="rounded-pill px-4 text-nowrap transition-all" onClick={() => navigate("/game/setup")}>
                                    <i className="bi bi-arrow-left me-2"></i> Study More
                                </Button>
                                <Button variant="primary" size="lg" className="rounded-pill px-4 fw-bold shadow-sm text-nowrap transition-all" onClick={() => handleEndpoints()}>
                                    Start Timer <i className="bi bi-play-fill ms-1"></i>
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
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

    const handleSegmentSelection = (id) => {
        const segmentIndex = segmentIdToIndex[id];
        props.setRoute(prevRoute => [...prevRoute, segments[segmentIndex]]);
    };

    const handleSegmentDeselection = (id) => {
        props.setRoute(prevRoute => prevRoute.filter(segment => {
            return getIdFromSegment(segment) !== id;
        }));
    };

    return (
        <>
            <Container className="py-4 d-flex flex-column align-items-center w-100">

                <Alert variant="primary" className="w-100 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-center rounded-4 mb-4 border-0">
                    <div className="mb-3 mb-md-0 text-center text-md-start">
                        <span className="fs-6 text-primary text-uppercase fw-bold d-block mb-1">Current Mission</span>
                        <span className="fs-4">
                            Connect <strong>{departureStationName}</strong> to <strong>{arrivalStationName}</strong>
                        </span>
                    </div>
                    <div className="bg-white text-dark px-4 py-2 rounded-pill shadow-sm fs-3 fw-bold d-flex align-items-center">
                        <i className="bi bi-clock-history text-danger me-3"></i>
                        <Countdown />
                    </div>
                </Alert>

                <div className="w-100 bg-white p-2 p-md-3 rounded-4 shadow-sm border mb-4 overflow-auto d-flex justify-content-center opacity-75">
                    <MetroMap lines={[]}
                        segments={[]}
                        stations={stations}
                        stationIdToIndex={stationIdToIndex}
                        lineIdToIndex={lineIdToIndex} />
                </div>

                <div className="w-100 mb-4">
                    <h4 className="fw-bold mb-3">Build Your Route</h4>
                    <SegmentList segments={displaySegments}
                        handleSegmentSelection={handleSegmentSelection}
                        handleSegmentDeselection={handleSegmentDeselection}
                        route={route}
                    />
                </div>

                <Button
                    variant="success"
                    size="lg"
                    className="rounded-pill px-5 py-3 fw-bold shadow-lg w-100 w-md-auto text-uppercase"
                    onClick={() => navigate('/game/execution')}
                >
                    Submit Route <i className="bi bi-check-circle-fill ms-2"></i>
                </Button>
            </Container>
        </>
    );
}

function SegmentList(props) {
    const segments = props.segments;
    return (
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-dark text-white py-3 border-0 d-none d-md-block">
                <Row className="fw-bold px-2 text-center align-items-center">
                    <Col md={3} className="text-start">From</Col>
                    <Col md={3} className="text-start">To</Col>
                    <Col md={2}>Line</Col>
                    <Col md={2}>Action</Col>
                    <Col md={2}>Sequence</Col>
                </Row>
            </Card.Header>

            <ListGroup id="segments-list" variant="flush">

                {segments.map((segment) => <SegmentInList
                    key={segment.id}
                    id={segment.id}
                    segment={segment}
                    handleSegmentSelection={props.handleSegmentSelection}
                    handleSegmentDeselection={props.handleSegmentDeselection}
                    route={props.route}
                />)}
            </ListGroup>
        </Card>
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
                <Row className="align-items-center text-center text-md-start">

                    <Col xs={12} md={3} className="fw-medium mb-2 mb-md-0">
                        <span className="d-inline d-md-none fw-bold text-muted me-2">From:</span>
                        {segment.fromStationName}
                    </Col>

                    <Col xs={12} md={3} className="fw-medium mb-2 mb-md-0">
                        <span className="d-inline d-md-none fw-bold text-muted me-2">To:</span>
                        {segment.toStationName}
                    </Col>

                    <Col xs={12} md={2} className="text-muted mb-3 mb-md-0 text-md-center">
                        <span className="d-inline d-md-none fw-bold text-muted me-2">Line:</span>
                        {segment.lineName}
                    </Col>

                    <Col xs={6} md={2} className="text-md-center">
                        {selected ?
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-3 fw-bold"
                                onClick={() => props.handleSegmentDeselection(props.id)}
                            >
                                <i className="bi bi-x-circle-fill me-1"></i> Remove
                            </Button> :
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-3 fw-bold"
                                onClick={() => props.handleSegmentSelection(props.id)}
                            >
                                <i className="bi bi-plus-circle-fill me-1"></i> Add
                            </Button>
                        }
                    </Col>

                    <Col xs={6} md={2} className="text-md-center">
                        {selected &&
                            <Badge bg="success" pill className="px-3 py-2 fs-6 shadow-sm">
                                Stop #{order + 1}
                            </Badge>}
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}

function Countdown(props) {
    const [seconds, setSeconds] = useState(MAX_GAME_DURATION);
    const navigate = useNavigate();

    useEffect(() => {
        const timerId = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds <= 1) {
                    clearInterval(timerId);
                    return 0;
                } else {
                    return prevSeconds - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [])

    useEffect(() => {
        if (seconds <= 0) {
            navigate('/game/execution');
        }
    }, [seconds, navigate]);

    return (
        <>
            <span className={seconds <= 10 ? "text-danger timer-pulse" : "text-dark"}>
                {seconds}s
            </span>
        </>
    );
}

function getIdFromSegment(segment) {
    return [segment.from_station_id, segment.to_station_id, segment.line_id].join("-");
}