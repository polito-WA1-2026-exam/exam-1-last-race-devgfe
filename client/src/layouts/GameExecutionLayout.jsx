import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Container, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useState, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";
import { executeRoute } from '../api/games-api.js';

export function GameExecutionLayout(props) {
    const { lines, stations, stationIdToIndex, lineIdToIndex, route } = useContext(GameContext);
    const navigate = useNavigate();
    const [appliedEvents, setAppliedEvents] = useState([]);
    const [score, setScore] = useState(-1);

    if (!lines.length || !stations.length) {
        return (
            <>
                <Container className="d-flex flex-column justify-content-center align-items-center py-5 mt-5">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="mt-4 text-muted fw-medium">Loading game data...</h4>
                </Container>
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
                <Container className="d-flex justify-content-center align-items-center py-5 mt-5 flex-grow-1">
                    <Card className="shadow-lg border-0 rounded-4 text-center p-4 p-md-5" style={{ maxWidth: '500px' }}>
                        <Card.Body>
                            <p className="text-muted fs-5 mb-4">
                                Are you ready to face the unexpected events and see if you survived the journey?
                                <br /><small className="text-muted fst-italic">(You only have one option anyway <i className="bi bi-emoji-wink text-warning"></i>)</small>
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                className="rounded-pill px-5 fw-bold shadow w-100"
                                onClick={() => handleExecution()}
                            >
                                <>Reveal My Fate <i className="bi bi-arrow-right-circle-fill ms-2"></i></>
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
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
            <Container className="py-5 d-flex flex-column align-items-center flex-grow-1">
                <Card className="shadow-lg border-0 rounded-4 w-100 overflow-hidden" style={{ maxWidth: '650px' }}>

                    <Card.Body className="p-4 p-md-5">

                        <div className="text-center mb-5">
                            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill fs-6 fw-medium shadow-sm">
                                <i className="bi bi-train-front-fill me-2"></i> {lineName}
                            </Badge>
                            <Row className="align-items-center justify-content-center">
                                <Col xs={12} md={5} className="text-md-end mb-2 mb-md-0">
                                    <h4 className="fw-bold text-dark m-0">{fromStationName}</h4>
                                    <span className="text-muted small text-uppercase">Departure</span>
                                </Col>
                                <Col xs={12} md={2} className="text-center my-3 my-md-0">
                                    <i className="bi bi-arrow-right text-primary fs-2 d-none d-md-inline-block"></i>
                                    <i className="bi bi-arrow-down text-primary fs-2 d-inline-block d-md-none"></i>
                                </Col>
                                <Col xs={12} md={5} className="text-md-start">
                                    <h4 className="fw-bold text-dark m-0">{toStationName}</h4>
                                    <span className="text-muted small text-uppercase">Arrival</span>
                                </Col>
                            </Row>
                        </div>

                        <Alert variant="info" className="rounded-4 shadow-sm border-0 p-4 mb-0 text-center">
                            <i className="bi bi-lightning-charge-fill text-info fs-1 mb-2 d-block"></i>
                            <h5 className="fw-bold mb-2">Event Occurred!</h5>
                            <p className="fs-5 m-0 text-dark">
                                {event.description}
                            </p>
                        </Alert>
                    </Card.Body>

                    <Card.Footer className="bg-white border-0 p-4 d-flex justify-content-end">
                        <Button
                            variant={segmentIndex === route.length - 1 ? "success" : "primary"}
                            size="lg"
                            className="rounded-pill px-4 fw-bold shadow-sm transition-all"
                            onClick={() => handleNextStep()}
                        >
                            {segmentIndex === route.length - 1 ?
                                <>Reveal Final Score <i className="bi bi-check-circle-fill ms-2"></i></>
                                : <>Next Stop <i className="bi bi-arrow-right-circle-fill ms-2"></i></>
                            }
                        </Button>
                    </Card.Footer>

                </Card>
            </Container>
        </>
    );
}