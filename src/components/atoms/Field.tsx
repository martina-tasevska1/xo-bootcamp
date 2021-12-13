import { setDoc, getFirestore, doc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { Game } from '../../context/game/state';

interface FieldProps {
    board: Game;
    boardId: string;
    move: string;
    id: string;
    value: string | undefined;
    moves: string[];
    setMoves: Function;
}

const Field: React.FC<FieldProps> = ({ id, value, move, board, boardId, moves, setMoves }) => {
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        console.log('re-rendered board');
    }, [board]);

    const makeMove = async () => {
        if (auth.currentUser) {
            console.log('board in makeMove: ', board);
            console.log('current user: ', auth.currentUser.uid, 'turn: ', board.turn);

            if (board.turn == auth.currentUser.uid) {
                if (value == '') {
                    console.log('value of field is empty:');
                    let otherPlayerId = '';
                    console.log('players:', board.players);
                    for (const playerId of Object.keys(board.players)) {
                        console.log('user id:', playerId);
                        if (playerId != auth.currentUser.uid) {
                            otherPlayerId = playerId;
                            console.log('changed turn:', otherPlayerId);
                        }
                    }
                    await setDoc(
                        doc(db, 'boards', boardId),
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
        <Box className="field" onClick={makeMove}>
            {value}
        </Box>
    );
};

export default Field;
