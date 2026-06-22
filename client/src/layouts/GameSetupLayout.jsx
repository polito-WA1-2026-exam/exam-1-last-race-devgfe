import { useNavigate } from 'react-router-dom';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useEffect, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";
import FeedbackContext from "../contexts/FeedbackContext.js";
import { MetroMap } from '../components/MetroMap.jsx';
import { getLines, getSegments, getStations } from '../api/metro-api.js';

export function GameSetupLayout(props) {
    const { lines, segments, stations, stationIdToIndex, lineIdToIndex } = useContext(GameContext);
    const { setFeedbackFromError } = useContext(FeedbackContext);
    const navigate = useNavigate();

    useEffect(() => {
        props.resetStates();
        Promise.all([
            getLines(),
            getSegments(),
            getStations()
        ]).then(results => {
            props.setLines(results[0]);
            props.setSegments(results[1]);
            props.setStations(results[2]);
        }).catch(err => {
            props.setLines([]);
            props.setSegments([]);
            props.setStations([]);
            setFeedbackFromError(err);
        });
    }, [])

    if (!lines.length || !segments.length || !stations.length) {
        return (
            <>
                <Container className="d-flex flex-column justify-content-center align-items-center py-5 mt-5">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <h4 className="mt-4 text-muted fw-medium">Loading Metro Map...</h4>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="py-4 d-flex flex-column align-items-center w-100">

                <div className="text-center mb-4">
                    <h2 className="fw-bold display-6 text-dark mb-2">
                        <i className="bi bi-map-fill text-primary me-3"></i>
                        Memorize the Map
                    </h2>
                </div>

                <div className="w-100 bg-white p-2 p-md-4 rounded-4 shadow-sm border mb-5 d-flex justify-content-center overflow-auto">
                    <MetroMap lines={lines}
                        segments={segments}
                        stations={stations}
                        stationIdToIndex={stationIdToIndex}
                        lineIdToIndex={lineIdToIndex} />
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="rounded-pill px-5 py-3 fw-bold shadow transition-all"
                    onClick={() => navigate('/game/planning')}
                >
                    Ready? Start Planning
                    <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                </Button>

            </Container>
        </>
    );
}