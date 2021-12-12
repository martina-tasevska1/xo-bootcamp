import Field from './Field';
import {
    getFirestore,
    getDocs,
    doc,
    setDoc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
    Timestamp,
    Unsubscribe,
    deleteDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import createGame from '../utils/createGame';
import addPlayerToGame from '../utils/addPlayerToGame';
import { queryExistingGame, queryGamesOpened } from '../utils/queries';
import { entries } from 'lodash';
import Button from '@mui/material/Button';

interface Game {
    id: string;
    createdAt: Timestamp;
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
}

function Game() {
    const db = getFirestore();
    const auth = getAuth();
    let navigate = useNavigate();

    const [board, setBoard] = useState<any>(null);
    const [boardId, setBoardId] = useState("");

    let unsubFromCurrentGame: Unsubscribe = null;
    const [move, setMove] = useState('');
    const [fields, setFields] = useState({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
    });
    const [moves, setMoves] = useState([]);

    const winningCombinations = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['0', '4', '8'],
        ['2', '4', '6'],
    ];

    useEffect(() => {
        let win = checkWin(moves);
        if (win) {
            console.log(`${move} won!`);
            window.alert(`${move} won!`);
        }
        console.log('moves in useEffect:', moves);
    }, [moves]);

    function checkWin(playerMoves: string[]): boolean {
        for (const combination of winningCombinations) {
            const result = combination.every(val => playerMoves.includes(val));
            if (result) {
                return result;
            }
        }
        return false;
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                //user is logged in
                console.log("There's a logged in user", user);
                const existingGamesSnap = await getDocs(queryExistingGame(user.uid)); //gets existing games with current user

                if (existingGamesSnap.empty) {
                    const gamesOpenedSnap = await getDocs(queryGamesOpened()); //gets existing games with 1 player
                    if (gamesOpenedSnap.empty) {
                        let newGameDoc = await createGame(user.uid); //creates new game
                        console.log('new game doc', newGameDoc);
                        listenToCurrentGame(user.uid, newGameDoc.id);

                        setBoard(newGameDoc);
                        setBoardId(newGameDoc.id);
                        setMove('X');
                        console.log('docid:', newGameDoc);
                        window.alert('Waiting for a second player. You are X');
                    } else {
                        addPlayerToGame(user.uid, gamesOpenedSnap.docs[0].id); //adds player to existing game
                        listenToCurrentGame(user.uid, gamesOpenedSnap.docs[0].id);
                        console.log('games opened snap', gamesOpenedSnap.docs[0].data());
                        setBoard({
                            ...gamesOpenedSnap.docs[0].data(),
                            id: gamesOpenedSnap.docs[0].id,
                        });
                        setBoardId(gamesOpenedSnap.docs[0].id);
                        setMove('O');
                        console.log('move in useEffect for O:', move);
                        console.log('docid:', gamesOpenedSnap.docs[0].id);
                        window.alert('Two players active. The game can begin. You are O');
                    }
                } else {
                    console.log('This user already has an active game');
                    listenToCurrentGame(user.uid, existingGamesSnap.docs[0].id);

                    console.log('existing  snap', existingGamesSnap.docs[0].data());

                    setBoard({
                        ...existingGamesSnap.docs[0].data(),
                        id: existingGamesSnap.docs[0].id,
                    });
                    setBoardId(existingGamesSnap.docs[0].id);
                    console.log('existing', existingGamesSnap);
                }
            } else {
                console.log('Must be logged in to play');
            }
        });

        return () => {
            unsubscribe();
            unsubFromCurrentGame?.();
        };
    }, []);

    const listenToCurrentGame = (userId: string, id: string) => {
        let unsubFromCurrentGame = onSnapshot(doc(db, 'boards', id), drawBoard);
    };

    const drawBoard = (snapshot: DocumentSnapshot<DocumentData>) => {
        const game: Game = snapshot.data() as Game;
        console.log('draw board');
        if (game) {
            if (game.fields) {
                console.log('Game in drawBoard:', game);
                setFields(game.fields);
            }
            setBoard(game);
        }
    };

    const logout = async () => {
        await auth.signOut();
        navigate('/');
        if (board.id) {
            await deleteDoc(doc(db, 'boards', board.id));
        }
        unsubFromCurrentGame?.();
    };
   
    return (
        <div>
            <div className="login">
                <Button variant="contained" onClick={logout}>
                    logout
                </Button>
            </div>
            <p className="description">Classic game for two players. O always starts.</p>
            <div className="board">
                {entries(fields).map(([k, v]) => (
                    <Field
                        key={k}
                        moves={moves}
                        setMoves={setMoves}
                        board={board}
                        boardId={boardId}
                        move={move}
                        id={`${k}`}
                        value={v}
                    ></Field>
                ))}
            </div>
        </div>
    );
}

export default Game;
