import { Game } from './state';

export enum ActionType {
    SET_GAME = 'set_game',
}

export interface Action {
    type: ActionType;
    payload: {
        game?: Game;
    };
}
