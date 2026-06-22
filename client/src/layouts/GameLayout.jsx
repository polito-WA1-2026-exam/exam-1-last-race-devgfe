import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap/";
import { GameExecutionLayout } from './GameExecutionLayout.jsx';
import { GamePlanningLayout } from './GamePlanningLayout.jsx';
import { GameResultLayout } from './GameResultLayout.jsx';
import { GameSetupLayout } from './GameSetupLayout.jsx';
import { NotFoundLayout } from './NotFoundLayout.jsx';
import GameContext from "../contexts/GameContext.js";

export function GameLayout(props) {
    const [lines, setLines] = useState([]);
    const [segments, setSegments] = useState([]);
    const [stations, setStations] = useState([]);
    const [route, setRoute] = useState([]);
    const [endpoints, setEndpoints] = useState(null);

    const stationIdToIndex = {};
    stations.forEach((station, index) => {
        stationIdToIndex[station.id] = index;
    });

    const lineIdToIndex = {};
    lines.forEach((line, index) => {
        lineIdToIndex[line.id] = index;
    });

    const resetStates = () => {
        setLines([]);
        setSegments([]);
        setStations([]);
        setRoute([]);
        setEndpoints(null);
    };

    return (
        <>
            <GameContext.Provider value={{ lines, segments, stations, stationIdToIndex, lineIdToIndex, route, endpoints }}>
                <Container className="py-4 d-flex flex-column flex-grow-1">
                    <Routes>
                        <Route path="setup" element={<GameSetupLayout
                            setLines={setLines}
                            setSegments={setSegments}
                            setStations={setStations}
                            resetStates={resetStates} />} />
                        <Route path="planning" element={<GamePlanningLayout setRoute={setRoute} setEndpoints={setEndpoints} />} />
                        <Route path="execution" element={<GameExecutionLayout />} />
                        <Route path="result" element={<GameResultLayout setShouldRefresh={props.setShouldRefresh} />} />
                        <Route path="*" element={<NotFoundLayout />} />
                    </Routes>
                </Container>
            </GameContext.Provider>
        </>
    );
}