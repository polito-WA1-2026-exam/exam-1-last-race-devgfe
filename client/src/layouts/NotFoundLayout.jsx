import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NotFoundLayout() {
    return (
        <>
            <Container className="text-center py-5 mt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6} className="d-flex flex-column align-items-center">
                        <img src="/src/assets/GitHub404.png"
                            alt="Page not found"
                            className="img-fluid mb-4"
                            style={{ maxWidth: '400px' }} />
                        <h1 className="display-5 fw-bold text-dark mb-3">
                            Oops! Page not found
                        </h1>
                        <p className="lead text-muted mb-5">
                            It seems you are lost. The page you are looking for does not exist or has been moved.
                        </p>
                        <Link to="/" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
                            <i className="bi bi-house-door-fill me-2"></i>
                            Go Home
                        </Link>
                    </Col>
                </Row>
            </Container>

        </>
    );
}