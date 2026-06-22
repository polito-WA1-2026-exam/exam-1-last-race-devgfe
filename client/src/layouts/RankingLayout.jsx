import { Col, Row, ListGroup, ListGroupItem, Container } from 'react-bootstrap/';
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

function GameList(props) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setFeedbackFromError } = useContext(FeedbackContext);

    useEffect(() => {
        setIsLoading(true);
        getRanking().then(response => {
            setIsLoading(false);
            setGames(response);
        }).catch(e => {
            setGames([]);
            setFeedbackFromError(e);
        })
    }, [])

    return (
        <>
            {isLoading ? <h3>Loading...</h3> :
                <Container>
                    <ListGroup id="games-list" variant="flush">
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
                </Container>
            }
        </>
    );
}

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