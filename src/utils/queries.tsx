import { collection, getFirestore, Query, query, where, orderBy, limit, Timestamp } from '@firebase/firestore';

export function queryExistingGame(userId:string) { //active games with player with userId
    const db = getFirestore();
    const boardsRef = collection(db, 'boards');
    const queryExistingGame: Query = query(boardsRef, where(`players.${userId}`, '==', ('X' || 'O')));
    return queryExistingGame;
}

export function queryGamesOpened(){ //active games with 1 player
    const db = getFirestore();
    const boardsRef = collection(db, 'boards');
    const queryGamesOpened: Query = query(
        boardsRef,
        where('totalPlayers', '==', 1),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    return queryGamesOpened;
}

