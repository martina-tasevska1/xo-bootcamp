import { Game } from './state';

export enum ActionType {
    SET_GAME = 'set_game',
    SET_GAME_ID = 'set_gameid',
    SET_MOVE = 'set_move',
}

export interface Action {
    type: ActionType;
    payload: {
        game?: Game;
        gameId?: string;
        move?: string;
    };
}
