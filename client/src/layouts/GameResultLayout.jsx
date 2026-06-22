import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { AppError } from "../models/errors/app-error.js";
import { useEffect } from 'react';

export function GameResultLayout(props) {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        props.setShouldRefresh(true);
    }, [])

    if (!state) {
        return (
            <>
                <h3>Loading...</h3>
            </>
        );
    }

    const score = state.score;
    const err = state.err;

    return (
        <>
            {err ?
                (<>
                    {err instanceof AppError ?
                        (<>
                            Oh no! Something went wrong while building the route:
                            {err.message}
                        </>)
                        : (<>
                            There was an error not related to the game:
                            {err.message}
                        </>)
                    }
                </>)
                : (<>
                    Your score is {score} coins!
                </>)
            }
            <Button onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/ranking")}>Ranking</Button>
            <Button onClick={() => navigate("/game/setup")}>Start a new game</Button>
        </>
    );
}