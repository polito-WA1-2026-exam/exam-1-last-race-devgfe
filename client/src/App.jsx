import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody, ToastContainer } from 'react-bootstrap/';
import { Route, Routes, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { doLogin, doLogout, checkSession } from './api/auth-api.js';
import { getMyBest } from './api/games-api.js'
import { GameLayout } from './layouts/GameLayout.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';
import { HomeLayout } from './layouts/HomeLayout.jsx';
import { InstructionLayout } from './layouts/InstructionLayout.jsx';
import { LoginLayout } from './layouts/LoginLayout.jsx';
import { RankingLayout } from './layouts/RankingLayout.jsx';
import { NotFoundLayout } from './layouts/NotFoundLayout.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";

function App() {

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [bestScore, setBestScore] = useState(-1);

    const navigate = useNavigate();
    const { state } = useLocation();

    const handleLogin = async (email, password) => {
        try {
            const user = await doLogin(email, password);
            setUser(user);
            setLoggedIn(true);
            setShouldRefresh(true);
            navigate(state?.from ?? '/');
        } catch (err) {
            setFeedbackFromError(err);
        }
    };

    const handleLogout = async () => {
        try {
            await doLogout();
        } catch (err) {
            setFeedbackFromError(err);
        } finally {
            setUser(null);
            setLoggedIn(false);
            navigate('/');
        }
    };

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message);
    };

    useEffect(() => {
        checkSession()
            .then(user => {
                setUser(user);
                setLoggedIn(true);
            })
            .catch(e => {
                setUser(null);
                setLoggedIn(false);
            })
    }, [])

    useEffect(() => {
        if (loggedIn) {
            getMyBest()
                .then(game => {
                    setBestScore(game.best_score)
                })
                .then(() => setShouldRefresh(false))
                .catch(e => setBestScore(-1))
        }
    }, [shouldRefresh, loggedIn])


    return (<>
        <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError }}>
            <Container fluid className="min-vh-100 d-flex flex-column py-3 bg-light">
                <Routes>
                    <Route path='/' element={<MainLayout handleLogout={handleLogout} user={user} loggedIn={loggedIn} bestScore={bestScore} />}>
                        <Route index element={<HomeLayout />} />
                        <Route path='login' element={loggedIn ?
                            <Navigate replace to={state?.from ?? '/'} /> :
                            <LoginLayout handleLogin={handleLogin} />
                        } />
                        <Route path="instruction" element={<InstructionLayout />} />
                        <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
                            <Route path='game/*' element={<GameLayout setShouldRefresh={setShouldRefresh} />} />
                            <Route path="ranking" element={<RankingLayout />} />
                        </Route>
                        <Route path="*" element={<NotFoundLayout />} />
                    </Route>
                </Routes>
                <ToastContainer className="p-4 mt-5" position="top-end" style={{ zIndex: 1050 }}>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        bg="white"
                        className="shadow-lg border border-secondary-subtle rounded-4"
                    >
                        <ToastBody className="text-dark d-flex align-items-center py-3">
                            <i className="bi bi-info-circle-fill fs-4 text-warning me-3"></i>
                            <span className="fw-medium fs-6">{feedback}</span>
                        </ToastBody>
                    </Toast>
                </ToastContainer>
            </Container>
        </FeedbackContext.Provider>
    </>);
}

function ProtectedRoute(props) {
    const location = useLocation();
    if (!props.loggedIn) {
        return <Navigate replace to="/login" state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}

export default App