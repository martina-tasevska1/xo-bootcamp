import './App.css';
import AuthenticationProvider from './AuthenticationProvider';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './config/fbconfig';

function App() {
    const app = initializeApp(firebaseConfig);
    return <AuthenticationProvider />;
}

export default App;
