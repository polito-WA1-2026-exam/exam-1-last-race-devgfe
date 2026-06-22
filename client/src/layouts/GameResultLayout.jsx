import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { AppError } from "../models/errors/app-error.js";
import { useEffect } from 'react';

export function GameResultLayout(props) {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        props.setShouldRefresh(true);
    }, [])

    if (!state) {
        return (
            <>
                <Container className="d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="mt-3 text-muted">Calculating results...</h4>
                </Container>
            </>
        );
    }

    const score = state.score;
    const err = state.err;

    return (
        <>
            <Container className="py-5 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <Row className="justify-content-center w-100">
                    <Col xs={12} md={10} lg={8}>

                        <Card className="shadow-lg border-0 rounded-4 text-center p-3 p-md-4">
                            <Card.Body>
                                {err ?
                                    (<>
                                        <Alert variant="danger" className="rounded-4 text-start shadow-sm mb-4">
                                            <Alert.Heading className="fw-bold fs-4 mb-3">
                                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                Oops! Something went wrong.
                                            </Alert.Heading>
                                            <hr />
                                            <p className="mb-0 fs-5">
                                                {err instanceof AppError ?
                                                    (<>
                                                        Error while building the route: {err.message}
                                                    </>)
                                                    : (<>
                                                        System error not related to the game: {err.message}
                                                    </>)
                                                }
                                            </p>
                                        </Alert>
                                    </>)
                                    : (<>
                                        <div className="py-4">
                                            <h1 className="display-3 fw-bold text-dark mb-4">
                                                Score: <span className="text-warning">{score}</span>
                                                <i className="bi bi-coin text-warning ms-3"></i>
                                            </h1>
                                        </div>
                                    </>)
                                }
                                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">

                                    <Button
                                        variant="outline-dark"
                                        className="rounded-pill px-4 py-2 w-100 w-md-auto transition-all"
                                        onClick={() => navigate("/ranking")}
                                    >
                                        <i className="bi bi-trophy-fill text-warning me-2"></i>
                                        Ranking
                                    </Button>

                                    <Button
                                        variant="primary"
                                        className="rounded-pill px-5 py-2 fw-bold shadow-sm w-100 w-md-auto transition-all"
                                        onClick={() => navigate("/game/setup")}
                                    >
                                        <i className="bi bi-play-circle-fill me-2"></i>
                                        Play Again
                                    </Button>

                                </div>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </>
    );
}