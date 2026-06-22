import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useEffect, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";
import FeedbackContext from "../contexts/FeedbackContext.js";
import { MetroMap } from '../components/MetroMap.jsx';
import { getLines, getSegments, getStations } from '../api/metro-api.js'

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
                <h3>Loading...</h3>
            </>
        );
    }

    return (
        <>
            <Container>
                <MetroMap lines={lines}
                    segments={segments}
                    stations={stations}
                    stationIdToIndex={stationIdToIndex}
                    lineIdToIndex={lineIdToIndex} />
                <Button onClick={() => navigate('/game/planning')}>Go next phase</Button>
            </Container>
        </>
    );
}