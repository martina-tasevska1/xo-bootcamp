import { addDoc, collection, doc, getDoc, getFirestore } from 'firebase/firestore';

async function createGame(userId: string) {
    const db = getFirestore();

    const docRef = await addDoc(collection(db, 'boards'), {
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
    });

    console.log('docref:', docRef);

    const _docData = await getDoc(docRef);

    return { ..._docData.data(), id: _docData.id };
}

export default createGame;
