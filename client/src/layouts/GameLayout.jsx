import { useContext, useState } from 'react';
import { getLines, getSegments, getStations } from '../api/metro-api.js'
import { Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap/";
import { GameExecutionLayout } from './GameExecutionLayout.jsx';
import { GamePlanningLayout } from './GamePlanningLayout.jsx';
import { GameResultLayout } from './GameResultLayout.jsx';
import { GameSetupLayout } from './GameSetupLayout.jsx';
import { NotFoundLayout } from './NotFoundLayout.jsx';
import FeedbackContext from "../contexts/FeedbackContext.js";
import GameContext from "../contexts/GameContext.js";

export function GameLayout(props) {
    const [lines, setLines] = useState([]);
    const [segments, setSegments] = useState([]);
    const [stations, setStations] = useState([]);
    const { setFeedbackFromError } = useContext(FeedbackContext);
    
    const startNewGame = async () => {
        try {
            const [fetchedLines, fetchedSegments, fetchedStations] = await Promise.all([
                getLines(),
                getSegments(),
                getStations()
            ]);
            setLines(fetchedLines);
            setSegments(fetchedSegments);
            setStations(fetchedStations);
        } catch (err) {
            setLines([]);
            setSegments([]);
            setStations([]);
            setFeedbackFromError(err);
        }
    }

    const stationIdToIndex = {};
    stations.forEach((station, index) => {
        stationIdToIndex[station.id] = index;
    });

    const lineIdToIndex = {};
    lines.forEach((line, index) => {
        lineIdToIndex[line.id] = index;
    });

    return (
        <>
            <GameContext.Provider value={{ lines, segments, stations, stationIdToIndex, lineIdToIndex }}>
                <Container>
                    <Routes>
                        <Route path="setup" element={<GameSetupLayout startNewGame={startNewGame} />} />
                        <Route path="planning" element={<GamePlanningLayout setShouldRefresh={props.setShouldRefresh} />} />
                        <Route path="execution" element={<GameExecutionLayout setShouldRefresh={props.setShouldRefresh} />} />
                        <Route path="result" element={<GameResultLayout />} />
                        <Route path="*" element={<NotFoundLayout />} />
                    </Routes>
                </Container>
            </GameContext.Provider>
        </>
    );
}