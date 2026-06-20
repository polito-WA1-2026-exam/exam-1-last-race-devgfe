import PropTypes from 'prop-types';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap/';
import { useEffect, useContext, useState } from 'react';
import { getRanking } from '../api/games-api.js'
import FeedbackContext from "../contexts/FeedbackContext.js";

export function RankingLayout(props) {
    return (
        <>
            <GameList />
        </>
    );
}

RankingLayout.propTypes = {};

function GameList(props) {
    const [games, setGames] = useState([]);
    const { setFeedbackFromError } = useContext(FeedbackContext);

    useEffect(() => {
        getRanking().then(response => {
            setGames(response);
        }).catch(e => {
            setGames([]);
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
                        Best score
                    </Col>
                </Row>
            </ListGroupItem>
            {games.map((game) => <GameInList
                key={game.id}
                game={game}
            />)}
        </ListGroup>
    );
}

GameList.propTypes = {};

function GameInList(props) {
    const game = props.game;

    return (
        <>
            <ListGroupItem>
                <Row>
                    <Col>
                        {game.user_name}
                    </Col>
                    <Col>
                        {game.best_score}
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}

GameInList.propTypes = {
    game: PropTypes.object.isRequired
};