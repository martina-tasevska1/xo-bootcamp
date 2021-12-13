import { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react';
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
