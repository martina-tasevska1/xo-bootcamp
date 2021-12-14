import { Game } from './state';

export enum ActionType {
    SET_GAME = 'set_game',
    SET_GAME_ID = 'set_gameid',
}

export interface Action {
    type: ActionType;
    payload: {
        game?: Game;
        gameId?: string;
    };
}
