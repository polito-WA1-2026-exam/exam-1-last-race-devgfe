import { Outlet } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Col, Container, Row } from "react-bootstrap/";

export function MainLayout(props) {
    return (
        <>
            <header>
                <Container>
                    <Row>
                        <Col>
                            <Link to="/">Last Race</Link>
                        </Col>
                        <Col>
                            {props.loggedIn ? (
                                <>
                                    <span>Welcome {props.user.name}!</span>
                                    {props.bestScore >= 0 ? (
                                        <span>Your actual best score is {props.bestScore} coins</span>
                                    ) : (
                                        <span>You've never played</span>
                                    )}
                                </>
                            ) : (
                                <span>Please log in to play</span>)}
                        </Col>
                        <Col>
                            {props.loggedIn ? <LogoutButton handleLogout={props.handleLogout} /> : <LoginButton />}
                        </Col>
                    </Row>
                </Container>
            </header>
            <Outlet />
        </>
    );
}

function LogoutButton(props) {
    return (
        <Button onClick={props.handleLogout}>Logout</Button>
    )
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button onClick={() => navigate('/login')}>Login</Button>
    )
}