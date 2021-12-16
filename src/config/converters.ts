import {
    DocumentData,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp,
} from 'firebase/firestore';
import { Game } from '../context/game/state';

interface GameFirestore extends Omit<Game, 'createdAt'> {
    createdAt: Timestamp;
}

export const gameConverter = {
    toFirestore(game: Game): DocumentData {
        return { ...game, createdAt: Timestamp.fromDate(game.createdAt) };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<GameFirestore>, options: SnapshotOptions): Game {
        const data = snapshot.data(options)!;
        return { ...data, createdAt: data.createdAt.toDate() };
    },
};
