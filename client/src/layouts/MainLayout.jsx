import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button, Container, Navbar, Nav, Badge } from "react-bootstrap";

export function MainLayout(props) {
    return (
        <>
            <div className="d-flex flex-column min-vh-100 bg-light">
                <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm py-3 mb-4 sticky-top">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center transition-all">
                            <i className="bi bi-flag-fill text-warning me-2"></i>
                            Last Race
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="main-navbar-nav" />
                        <Navbar.Collapse id="main-navbar-nav">

                            <Nav className="me-auto ms-md-4 align-items-md-center mt-3 mt-md-0">

                                {props.loggedIn ? (
                                    <>
                                        <div className="d-flex flex-column flex-md-row align-items-md-center text-light">
                                            <span className="me-md-3 mb-2 mb-md-0 fs-6">
                                                Welcome, <strong className="text-white">{props.user.name}</strong>!
                                            </span>

                                            {props.bestScore >= 0 ? (
                                                <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill shadow-sm fs-6">
                                                    <i className="bi bi-coin me-1"></i> Best: {props.bestScore}
                                                </Badge>
                                            ) : (
                                                <Badge bg="secondary" className="px-3 py-2 rounded-pill fw-normal">
                                                    No games played yet
                                                </Badge>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-white-50 fst-italic">Please log in to play</span>
                                )}
                            </Nav>

                            <Nav className="ms-auto mt-3 mt-md-0">
                                {props.loggedIn ? <LogoutButton handleLogout={props.handleLogout} /> : <LoginButton />}
                            </Nav>

                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <main className="flex-grow-1 d-flex flex-column">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

function LogoutButton(props) {
    return (
        <Button
            variant="outline-light"
            className="rounded-pill px-4 fw-medium transition-all"
            onClick={props.handleLogout}
        >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
        </Button>
    )
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button
            variant="primary"
            className="rounded-pill px-4 fw-bold shadow-sm transition-all"
            onClick={() => navigate('/login')}
        >
            <i className="bi bi-person-circle me-2"></i>
            Login
        </Button>
    )
}