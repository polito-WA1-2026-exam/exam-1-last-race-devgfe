import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useEffect, useContext } from 'react';
import GameContext from "../contexts/GameContext.js";
import { MetroMap } from '../components/MetroMap.jsx';

export function GameSetupLayout(props) {
    const { lines, segments, stations, stationIdToIndex, lineIdToIndex } = useContext(GameContext);
    const navigate = useNavigate();

    useEffect(() => {
        props.startNewGame()
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