import { useState } from 'react';
import { Button, Col, Form, Row, Card, Container } from 'react-bootstrap';

export function LoginLayout(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        props.handleLogin(email, password);
    };

    return (
        <>
            <Container>
                <Row className="vh-100 justify-content-center align-items-center">
                    <Col xs={12} sm={8} md={6} lg={4} >

                        <Card className="shadow-lg border-0 rounded-4 p-3">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-block p-3 mb-3">
                                        <i className="bi bi-person-circle fs-1 text-primary"></i>
                                    </div>
                                    <h2 className="fw-bold mb-1">Welcome Back</h2>
                                    <p className="text-muted">Please sign in to continue</p>
                                </div>


                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4" controlId="email">
                                        <Form.Label className="fw-medium">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            size="lg"
                                            className="bg-light"
                                            value={email}
                                            placeholder="Example: mario@test.com"
                                            onChange={(ev) => setEmail(ev.target.value)}
                                            required={true}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="password">
                                        <Form.Label className="fw-medium">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            size="lg"
                                            className="bg-light"
                                            value={password}
                                            placeholder="Enter the password."
                                            onChange={(ev) => setPassword(ev.target.value)}
                                            required={true}
                                            minLength={6}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        className="w-100 rounded-pill fw-bold shadow-sm mt-2"
                                    >Sign In</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}