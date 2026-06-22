import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

export function LoginLayout(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        props.handleLogin(email, password);
    };

    return (
        <>
            <Row className="mt-3 vh-100 justify-content-md-center">
                <Col md={4} >
                    <h1 className="pb-3">Login</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email} placeholder="Example: mario@test.com"
                                onChange={(ev) => setEmail(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password} placeholder="Enter the password."
                                onChange={(ev) => setPassword(ev.target.value)}
                                required={true} minLength={6}
                            />
                        </Form.Group>
                        <Button className="mt-3" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
}