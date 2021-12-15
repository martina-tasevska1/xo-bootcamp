import { createContext, Dispatch, useEffect, useMemo, useReducer, useContext } from 'react';
import { Action, ActionType } from './actions';
import { reducer } from './reducer';
import { initialState, State } from './state';

const Context = createContext<{ state?: State; dispatch?: Dispatch<Action> }>({});

export const GameContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState });

    const contextValue = useMemo(
        () => ({
            state,
            dispatch,
        }),
        [state, dispatch]
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const GameContextConsumer = () => {
    console.log('window', window);
    return (
        <Context.Consumer>
            {values => {
                if (window._REACT_CONTEXT_DEVTOOL) {
                    window._REACT_CONTEXT_DEVTOOL({
                        id: 'game_context',
                        displayName: 'Game context consumer',
                        values,
                    });
                }
                return null;
            }}
        </Context.Consumer>
    );
};

const useState = () => {
    const { state } = useContext(Context);
    return state;
}

const useDispatch = () => {
    const { dispatch } = useContext(Context);
    return dispatch;
}

export const useGame = () => {
    const state = useState();
    const dispatch = useDispatch();

    // camelCase

    // PascalCase

    // snake_case

    // kebab-case

    return {
        game: state.game,
        gameId: state.gameId,
        move: state.move,
        setGame: (newGame) => {
            dispatch({ type: ActionType.SET_GAME, payload: {game: newGame} });
        },
        setGameId: (newId) => {
            dispatch({ type: ActionType.SET_GAME_ID, payload: { gameId: newId } });
        },
        setMove: (move) => {
            dispatch({ type: ActionType.SET_MOVE, payload: { move: move } });
        }
    }
}

