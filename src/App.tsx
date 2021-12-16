import './styles/App.css';
import AuthenticationProvider from './components/AuthenticationProvider';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config/fbconfig';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

declare global {
    interface Window {
        _REACT_CONTEXT_DEVTOOL: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

function App() {
    const app = initializeApp(firebaseConfig);
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <AuthenticationProvider />
            </Provider>
        </ThemeProvider>
    );
}

export default App;
