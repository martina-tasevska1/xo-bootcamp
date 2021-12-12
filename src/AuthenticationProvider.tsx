import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, Unsubscribe } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Game from './models/Game';

function AuthenticationProvider() {
    const auth = getAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    let unsubAuth: Unsubscribe | null = null;

    useEffect(() => {
        unsubAuth = auth.onAuthStateChanged(async user => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });
        return () => {
            unsubAuth?.();
        };
    }, []);

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
                    <Route path="/" element={<Game />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default AuthenticationProvider;
