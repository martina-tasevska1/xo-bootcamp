import './styles/App.css';
import AuthenticationProvider from './components/AuthenticationProvider';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './config/fbconfig';

declare global {
    interface Window {
        _REACT_CONTEXT_DEVTOOL: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

function App() {
    const app = initializeApp(firebaseConfig);
    return <AuthenticationProvider />;
}

export default App;
