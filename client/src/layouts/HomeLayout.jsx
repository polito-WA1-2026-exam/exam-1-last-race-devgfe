import { Button, Col, Container, Row } from "react-bootstrap/";
import { useNavigate } from 'react-router-dom';

export function HomeLayout(props) {
    const navigate = useNavigate();
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Button onClick={() => navigate('/instruction')}>Discover the game</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => navigate('/game/setup')}>Play now</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => navigate('/ranking')}>Look ranking</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}