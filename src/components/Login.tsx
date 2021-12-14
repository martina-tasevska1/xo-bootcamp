import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, TextField, FormControl, FormLabel, FormGroup } from '@mui/material';

import { useForm } from 'react-hook-form';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    let navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log(userCredentials);
            })
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                window.alert('Unsuccessful login');
            });
    };

    return (
        <Box sx={{}}>
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    gap: '3px',
                    backgroundColor: 'rgb(186, 202, 224)',
                    padding: '5px',
                }}
                onSubmit={handleSubmit(login)}
            >
                <FormLabel>
                    <TextField
                        onChange={event => setEmail(event.target.value)}
                        className="input"
                        type="text"
                        placeholder="email"
                        size="small"
                    />
                </FormLabel>
                <FormLabel>
                    <TextField
                        onChange={event => setPassword(event.target.value)}
                        className="input"
                        type="password"
                        placeholder="password"
                        size="small"
                    />
                </FormLabel>
                <Button type="submit" variant="contained" value="login" onClick={login}>
                    login
                </Button>
            </FormGroup>
            <Box
                sx={{
                    fontFamily: 'Indie Flower, cursive',
                    textAlign: 'center',
                    fontSize: '80px',
                    marginTop: '50px',
                }}
            >
                XO
            </Box>
            <Box
                sx={{ fontFamily: 'Indie Flower, cursive', textAlign: 'center', fontSize: '20px' }}
            >
                {' '}
                Please log in to play
            </Box>
        </Box>
    );
}

export default Login;
