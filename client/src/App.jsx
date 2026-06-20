import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody } from 'react-bootstrap/';
import { Route, Routes, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { doLogin, doLogout, checkSession } from './api/auth-api.js';
import { GameExecutionLayout } from './layouts/GameExecutionLayout.jsx';
import { GameLayout } from './layouts/GameLayout.jsx';
import { GamePlanningLayout } from './layouts/GamePlanningLayout.jsx';
import { GameResultLayout } from './layouts/GameResultLayout.jsx';
import { GameSetupLayout } from './layouts/GameSetupLayout.jsx';
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

    const navigate = useNavigate();
    const { state } = useLocation();

    const handleLogin = async (email, password) => {
        try{
            const user = await doLogin(email, password);
            setUser(user);
            setLoggedIn(true);
            setFeedback("Welcome, " + user.name);
            navigate(state?.from ?? '/');
        } catch (err) {
            setFeedbackFromError(err);
        }       
    };            

    const handleLogout = async () => {
        try{
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
        checkSession().then(user => {
            setUser(user);
            setLoggedIn(true);
        }).catch(e => {
            setUser(null);
            setLoggedIn(false);
        })
    }, [])

    return (<>
        <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError }}>
            <Container>
                <Routes>
                    <Route path='/' element={<MainLayout handleLogout={handleLogout} user={user} loggedIn={loggedIn} />}>
                        <Route index element={<HomeLayout />} />
                        <Route path='login' element={loggedIn ?
                            <Navigate replace to={state?.from ?? '/'} /> :
                            <LoginLayout handleLogin={handleLogin} />
                        } />
                        <Route path="instruction" element={<InstructionLayout />} />
                        <Route element={<ProtectedRoute loggedIn={loggedIn}/>}>
                            <Route path='game' element={<GameLayout />}>
                                <Route path="setup" element={<GameSetupLayout />} />
                                <Route path="planning" element={<GamePlanningLayout />} />
                                <Route path="execution" element={<GameExecutionLayout />} />
                                <Route path="result" element={<GameResultLayout />} />
                            </Route>
                            <Route path="ranking" element={<RankingLayout />} />
                        </Route>
                        <Route path="*" element={<NotFoundLayout />} />
                    </Route>
                </Routes>
                <Toast
                    show={feedback !== ''}
                    autohide
                    onClose={() => setFeedback('')}
                    delay={4000}
                    position="top-end"
                    className="position-fixed top-0 end-0 m-3"
                >
                    <ToastBody>
                        {feedback}
                    </ToastBody>
                </Toast>
            </Container>
        </FeedbackContext.Provider>
    </>);
}

function ProtectedRoute(props){
    const location = useLocation();
    if(!props.loggedIn) {
        return <Navigate replace to="/login" state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}

export default App