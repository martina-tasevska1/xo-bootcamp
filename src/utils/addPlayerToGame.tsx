import { setDoc, doc, getFirestore, increment } from 'firebase/firestore';

async function addPlayerToGame(userId: string, gameId: string) {
    const db = getFirestore();
    await setDoc(
        //adds logged in player to existing active game with 1 player
        doc(db, 'boards', gameId),
        {
            players: {
                [userId]: 'O',
            },
            totalPlayers: increment(1),
            turn: userId,
        },
        { merge: true }
    );
    console.log('userId in add player to game:', userId);
}

export default addPlayerToGame;
