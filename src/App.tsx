import './styles/App.css';
import AuthenticationProvider from './components/AuthenticationProvider';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config/fbconfig';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
    typography: {
        fontFamily: 'Indie Flower',
    },
});

declare global {
    interface Window {
        _REACT_CONTEXT_DEVTOOL: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

function App() {
    const app = initializeApp(firebaseConfig);
    return(
    <ThemeProvider theme={theme}>
        <AuthenticationProvider />
    </ThemeProvider>
    )
}

export default App;
