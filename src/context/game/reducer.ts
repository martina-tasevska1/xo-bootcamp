import { Action, ActionType } from './actions';
import { State } from './state';

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.SET_GAME: {
            const { game } = action.payload;

            return {
                ...state,
                game,
            };
        }
        case ActionType.SET_GAME_ID: {
            const { gameId } = action.payload;

            return {
                ...state,
                gameId,
            };
        }
        default: {
            throw new Error(`Unhandled type: ${action.type}`);
        }
    }
};
