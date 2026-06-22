import { Button, Col, Container, Row } from "react-bootstrap/";
import { useNavigate } from 'react-router-dom';

export function HomeLayout(props) {
    const navigate = useNavigate();
    return (
        <>
            <Container className="py-5 text-center mt-4">

                {/* Hero Header Section */}
                <Row className="justify-content-center mb-5">
                    <Col xs={12} md={8} lg={6}>
                        <div className="mb-4">
                            <i className="bi bi-controller text-primary" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h1 className="display-4 fw-bold text-dark mb-3">
                            Welcome to <span className="text-primary">Last Race</span>
                        </h1>
                    </Col>
                </Row>

                {/* Call to Action Buttons */}
                <Row className="justify-content-center g-4 mx-auto" style={{ maxWidth: '800px' }}>

                    {/* Secondary Action: Instructions */}
                    <Col xs={12} md={4} className="d-flex">
                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="w-100 rounded-pill shadow-sm fw-medium py-3 transition-all"
                            onClick={() => navigate('/instruction')}
                        >
                            <i className="bi bi-book-half me-2"></i>
                            How to Play
                        </Button>
                    </Col>

                    {/* Primary Action: Play Game */}
                    <Col xs={12} md={4} className="d-flex">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100 rounded-pill shadow fw-bold py-3 transition-all"
                            onClick={() => navigate('/game/setup')}
                        >
                            <i className="bi bi-play-circle-fill me-2 fs-5"></i>
                            Play Now
                        </Button>
                    </Col>

                    {/* Secondary Action: Ranking */}
                    <Col xs={12} md={4} className="d-flex">
                        <Button
                            variant="outline-dark"
                            size="lg"
                            className="w-100 rounded-pill shadow-sm fw-medium py-3 transition-all"
                            onClick={() => navigate('/ranking')}
                        >
                            <i className="bi bi-trophy-fill text-warning me-2"></i>
                            Leaderboards
                        </Button>
                    </Col>

                </Row>
            </Container>
        </>
    );
}