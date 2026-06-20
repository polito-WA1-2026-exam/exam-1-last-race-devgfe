import { useEffect, useContext, useState } from 'react';
import { getLines, getSegments, getStations } from '../api/metro-api.js'
import FeedbackContext from "../contexts/FeedbackContext.js";
import { Outlet } from 'react-router-dom';

export function GameLayout(props) {
    const [lines, setLines] = useState([]);
    const [segments, setSegments] = useState([]);
    const [stations, setStations] = useState([]);
    const { setFeedbackFromError } = useContext(FeedbackContext);

    useEffect(() => {
        getLines().then(response => {
            setLines(response);
        }).catch(e => {
            setLines([]);
            setFeedbackFromError(e);
        })
    }, [])

    useEffect(() => {
        getSegments().then(response => {
            setSegments(response);
        }).catch(e => {
            setSegments([]);
            setFeedbackFromError(e);
        })
    }, [])

    useEffect(() => {
        getStations().then(response => {
            setStations(response);
        }).catch(e => {
            setStations([]);
            setFeedbackFromError(e);
        })
    }, [])

    return (
        <>
            <Outlet />
        </>
    );
}