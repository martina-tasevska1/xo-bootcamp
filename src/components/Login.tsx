import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';





function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    let navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const login = () => {
    
            signInWithEmailAndPassword(auth, email, password).then(userCredentials => {
                console.log(userCredentials);
            }).then(() => {
                navigate('/');
            }).catch(() => {
                window.alert("Unsuccessful login");
            });
    };


    return (
        <div>
            <form className="login" onSubmit={handleSubmit(login)}>
                <input
                    onChange={event => setEmail(event.target.value)}
                    className="input"
                    type="text"
                    placeholder="email"
                />
                <input
                    onChange={event => setPassword(event.target.value)}
                    className="input"
                    type="password"
                    placeholder="password"
                />
                <Button type="submit" variant="outlined" value="login" onClick={login}>login</Button>
            </form>
            <div className="welcome">XO</div>
            <p className="login-msg"> Please log in to play</p>
        </div>
    );
}

export default Login;
