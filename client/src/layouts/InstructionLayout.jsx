import { Col, Row, ListGroup, ListGroupItem, Container, Card, Spinner, Badge } from 'react-bootstrap';
import { useEffect, useContext, useState } from 'react';
import { getEvents } from '../api/events-api.js';
import FeedbackContext from "../contexts/FeedbackContext.js";

export function InstructionLayout(props) {
    return (
        <>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} lg={10}>

                        <div className="text-center mb-4">
                            <h1 className="display-6 fw-bold text-dark">
                                <i className="bi bi-controller text-primary me-3"></i>
                                How to Play "Last Race"
                            </h1>
                        </div>

                        <Card className="shadow-sm border-0 rounded-4 bg-light mb-5">
                            <Card.Body className="p-4 px-md-5">
                                <ul className="fs-5 mb-0 text-dark" style={{ lineHeight: '1.8' }}>
                                    <li className="mb-2">
                                        <strong>Memorize the Map:</strong> The game starts by showing you the map you need to memorize.
                                    </li>
                                    <li className="mb-2">
                                        <strong>Plan Your Route:</strong> You then have 90 seconds to create a route between two endpoints provided by the game.
                                    </li>
                                    <li className="mb-2">
                                        <strong>Face the Events:</strong> After submitting, the route will be verified. Random events will be applied, which will affect your coin stash.
                                    </li>
                                    <li>
                                        <strong>Final Score:</strong> At the end, you will get a score based on the coins you have left!
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>

                        <div className="mb-4">
                            <h3 className="fw-bold">
                                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                                Possible Events
                            </h3>
                            <p className="text-muted fs-5">
                                Watch out for these scenarios along your route. They can make or break your run!
                            </p>
                        </div>

                        <EventList />

                    </Col>
                </Row>
            </Container>
        </>
    );
}

function EventList(props) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setFeedbackFromError } = useContext(FeedbackContext);

    useEffect(() => {
        setIsLoading(true);
        getEvents().then(response => {
            setIsLoading(false);
            setEvents(response);
        }).catch(e => {
            setEvents([]);
            setFeedbackFromError(e);
        })
    }, [])

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                <h5 className="mt-3 text-muted">Loading events...</h5>
            </div>
        );
    }

    return (
        <>
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Card.Header className="bg-dark text-white py-3 border-0 d-none d-md-block">
                    <Row className="fw-bold px-2">
                        <Col md={3}>Event Name</Col>
                        <Col md={7}>Description</Col>
                        <Col md={2} className="text-end">Effect</Col>
                    </Row>
                </Card.Header>

                <ListGroup id="events-list" variant="flush">
                    {events.map((event) => <EventInList
                        key={event.id}
                        event={event}
                    />)}
                </ListGroup>
            </Card>
        </>

    );
}

function EventInList(props) {
    const event = props.event;

    return (
        <>
            <ListGroupItem className="py-3 px-4 border-bottom">
                <Row className="align-items-center">
                    <Col xs={12} md={3} className="fw-bold text-primary mb-2 mb-md-0 fs-5">
                        {event.name}
                    </Col>
                    <Col xs={12} md={7} className="text-secondary mb-2 mb-md-0">
                        {event.description}
                    </Col>
                    <Col xs={12} md={2} className="text-md-end">
                        <Badge bg="secondary" pill className="px-3 py-2 fs-6 shadow-sm">
                            {event.effect}
                        </Badge>
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}