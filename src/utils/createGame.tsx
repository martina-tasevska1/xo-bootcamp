import {
    addDoc,
    collection,
    CollectionReference,
    doc,
    getDoc,
    getFirestore,
    Timestamp,
} from 'firebase/firestore';
import { gameConverter } from '../config/converters';
import { Game } from '../context/game/state';

async function createGame(userId: string) {
    const db = getFirestore();

    const collectionReference = collection(db, 'boards').withConverter(gameConverter);

    const docRef = await addDoc<Game>(
        collectionReference as CollectionReference<Game>,
        {
            //creates new game with logged in player
            fields: {
                0: '',
                1: '',
                2: '',
                3: '',
                4: '',
                5: '',
                6: '',
                7: '',
                8: '',
            },
            players: {
                [userId]: 'X',
            },
            totalPlayers: 1,
            createdAt: new Date(),
            turn: '',
        } as Game
    );

    console.log('docref:', docRef);

    const _docData = await getDoc(docRef);

    return { ..._docData.data(), id: _docData.id };
}

export default createGame;
