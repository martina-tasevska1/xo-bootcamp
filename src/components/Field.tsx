import { setDoc, getFirestore, doc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import { getAuth } from 'firebase/auth';
import { useGame } from '../context/game';

interface FieldProps {
    move: string;
    id: string;
    value: string | undefined;
    moves: string[];
    setMoves: Function;
}

const Field: React.FC<FieldProps> = ({ id, value, move, moves, setMoves }) => {
    const db = getFirestore();
    const auth = getAuth();
    const { game, gameId } = useGame();

    const makeMove = async () => {
        if (auth.currentUser) {
            console.log('board in makeMove: ', game);
            console.log('current user: ', auth.currentUser.uid, 'turn: ', game.turn);

            if (game.turn == auth.currentUser.uid) {
                if (value == '') {
                    console.log('value of field is empty:');
                    let otherPlayerId = '';
                    console.log('players:', game.players);
                    for (const playerId of Object.keys(game.players)) {
                        console.log('user id:', playerId);
                        if (playerId != auth.currentUser.uid) {
                            otherPlayerId = playerId;
                            console.log('changed turn:', otherPlayerId);
                        }
                    }
                    await setDoc(
                        doc(db, 'boards', gameId),
                        {
                            fields: {
                                [id]: move,
                            },
                            turn: otherPlayerId,
                        },
                        { merge: true }
                    );
                    console.log(`clicked field ${id}`);
                    setMoves([...moves, id]);
                }
            }
        }
    };

    return (
        <Box onClick={makeMove}
        sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '50px', cursor: 'pointer', fontFamily: 'Indie Flower, cursive'}}
        >
            {value}
        </Box>
    );
};

export default Field;
