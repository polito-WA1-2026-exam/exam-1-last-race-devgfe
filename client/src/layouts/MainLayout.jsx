import { Outlet } from 'react-router-dom';
import { PropTypes } from "prop-types";
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
                            {props.loggedIn && "Welcome " + props.user.name + "!"}
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

MainLayout.propTypes = {
    handleLogout: PropTypes.func,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
}

function LogoutButton(props) {
    return (
        <Button onClick={props.handleLogout}>Logout</Button>
    )
}

LogoutButton.propTypes = {
    handleLogout: PropTypes.func
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button onClick={() => navigate('/login')}>Login</Button>
    )
}