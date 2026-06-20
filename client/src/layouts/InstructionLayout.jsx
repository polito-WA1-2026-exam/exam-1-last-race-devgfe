import PropTypes from 'prop-types';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap/';
import { useEffect, useContext, useState } from 'react';
import { getEvents } from '../api/events-api.js'
import FeedbackContext from "../contexts/FeedbackContext.js";

export function InstructionLayout(props) {
    return (
        <>
            <p>
                The instructions for "Last Race" are as follows:
                - The game starts by showing you the map you need to memorize.
                - You then have 90 seconds to create a route between two endpoints provided by the game.
                - After submitting, the route will be verified and events will be applied, which will affect the coins you have.
                - At the end, you will get a score based on the coins you have left.
                The events that can happen are:
            </p>

            <EventList />
        </>
    );
}

InstructionLayout.propTypes = {};

function EventList(props) {
    const [events, setEvents] = useState([]);
    const { setFeedbackFromError } = useContext(FeedbackContext);

    useEffect(() => {
        getEvents().then(response => {
            setEvents(response);
        }).catch(e => {
            setEvents([]);
            setFeedbackFromError(e);
        })
    }, [])

    return (
        <ListGroup id="films-list" variant="flush">
            <ListGroupItem>
                <Row>
                    <Col>
                        Name
                    </Col>
                    <Col>
                        Description
                    </Col>
                    <Col>
                        Effect
                    </Col>
                </Row>
            </ListGroupItem>
            {events.map((event) => <EventInList
                key={event.id}
                event={event}
            />)}
        </ListGroup>
    );
}

EventList.propTypes = {};

function EventInList(props) {
    const event = props.event;

    return (
        <>
            <ListGroupItem>
                <Row>
                    <Col>
                        {event.name}
                    </Col>
                    <Col>
                        {event.description}
                    </Col>
                    <Col>
                        {event.effect}
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}

EventInList.propTypes = {
    event: PropTypes.object.isRequired
};