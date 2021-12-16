import { setDoc, getFirestore, doc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
// import { useGame } from '../context/game';
import { selectGame } from '../redux/gameSlice';
import { selectGameId } from '../redux/gameIdSlice';
import { selectMove } from '../redux/moveSlice';

interface FieldProps {
    id: string;
    value: string | undefined;
    moves: string[];
    setMoves: Function;
}

const Field: React.FC<FieldProps> = ({ id, value, moves, setMoves }) => {
    const db = getFirestore();
    const auth = getAuth();
    // const { game, gameId } = useGame();
    const game = useSelector(selectGame);

    const makeMove = async () => {
        if (auth.currentUser) {
            console.log('current user: ', auth.currentUser.uid, 'turn: ', game.turn);

            if (game.turn == auth.currentUser.uid) {
                if (value == '') {
                    let otherPlayerId = '';
                    for (const playerId of Object.keys(game.players)) {
                        if (playerId != auth.currentUser.uid) {
                            otherPlayerId = playerId;
                            console.log('changed turn:', otherPlayerId);
                        }
                    }
                    await setDoc(
                        doc(db, 'boards', game.id),
                        {
                            fields: {
                                [id]: game.players[auth.currentUser.uid],
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
        <Box
            onClick={makeMove}
            sx={{
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '50px',
                cursor: 'pointer',
                fontFamily: 'Indie Flower, cursive',
            }}
        >
            {value}
        </Box>
    );
};

export default Field;
