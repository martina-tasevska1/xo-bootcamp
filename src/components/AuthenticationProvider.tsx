import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, Unsubscribe } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Login from './Login';
import Game from './Game';
import { GameContextConsumer, GameContextProvider } from '../context/game';


function AuthenticationProvider() {
    const auth = getAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    let unsubAuth: Unsubscribe | null = null;
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        unsubAuth = auth.onAuthStateChanged(async user => {
            if (user) {
                setLoggedIn(true);
                setUserEmail(user.email);
                console.log('UserEmail: ', userEmail);
            } else {
                setLoggedIn(false);
            }
        });
        return () => {
            unsubAuth?.();
        };
    }, []);
    console.log('UserEmail: ', userEmail);

    return (
            <BrowserRouter>
            {!loggedIn && (
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
                {loggedIn && (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                    <Game />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
                
            </BrowserRouter>
    );
}

export default AuthenticationProvider;
