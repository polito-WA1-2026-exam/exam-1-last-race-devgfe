import { Col, Row, ListGroup, ListGroupItem, Container, Spinner, Card, Badge } from 'react-bootstrap';
import { useEffect, useContext, useState } from 'react';
import { getRanking } from '../api/games-api.js';
import FeedbackContext from "../contexts/FeedbackContext.js";

export function RankingLayout(props) {
    return (
        <>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>
                        <div className="text-center mb-4">
                            <h2 className="display-6 fw-bold text-dark mb-2">
                                <i className="bi bi-trophy-fill text-warning me-3"></i>
                                Global Leaderboard
                            </h2>
                        </div>
                        <GameList />
                    </Col>
                </Row>
            </Container>
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

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                <h5 className="mt-3 text-muted">Loading rankings...</h5>
            </div>
        );
    }

    return (
        <>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">

                {/* Table Header */}
                <Card.Header className="bg-primary text-white py-3 border-0">
                    <Row className="fw-bold align-items-center px-2">
                        <Col xs={2} className="text-center">Rank</Col>
                        <Col xs={6}>Player</Col>
                        <Col xs={4} className="text-end">Best Score</Col>
                    </Row>
                </Card.Header>

                <ListGroup id="games-list" variant="flush">
                    {games.map((game, index) => <GameInList
                        key={game.id}
                        rank={index + 1}
                        game={game}
                    />)}
                </ListGroup>
            </Card>
        </>
    );
}

function GameInList(props) {
    const game = props.game;

    return (
        <>
            <ListGroupItem>
                <Row>
                    <Col xs={2} className="text-center fw-bold">
                        <span className="fs-3">{props.rank}</span>
                    </Col>
                    <Col xs={6} className="fw-medium text-dark text-truncate fs-5">
                        {game.user_name}
                    </Col>
                    <Col xs={4} className="text-end fw-bold text-primary fs-4">
                        {game.best_score}
                    </Col>
                </Row>
            </ListGroupItem>
        </>
    );
}