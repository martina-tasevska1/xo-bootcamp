import {
    collection,
    getFirestore,
    Query,
    query,
    where,
    orderBy,
    limit,
    CollectionReference,
} from '@firebase/firestore';
import { Game } from '../context/game/state';

export function queryExistingGame(userId: string) {
    //active games with player with userId
    const db = getFirestore();
    const queryExistingGame = query<Game>(
        collection(db, 'boards') as CollectionReference<Game>,
        where(`players.${userId}`, '==', 'X' || 'O')
    );
    return queryExistingGame;
}

export function queryGamesOpened() {
    //active games with 1 player
    const db = getFirestore();
    const queryGamesOpened = query<Game>(
        collection(db, 'boards') as CollectionReference<Game>,
        where('totalPlayers', '==', 1),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    return queryGamesOpened;
}
