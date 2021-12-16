export interface Game {
    id?: string;
    createdAt: Date;
    turn: string;
    fields: {
        0: string;
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
    };
    players: {
        [id: string]: string;
    };
    totalPlayers: number;
}

export interface State {
    game: Game;
    gameId: string;
    move: string;
}

export const initialState: State = {
    game: null,
    gameId: '',
    move: '',
};
