import Field from '../atoms/Field';
import {
    getFirestore,
    getDocs,
    doc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
    Timestamp,
    Unsubscribe,
    deleteDoc,
} from 'firebase/firestore';
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import createGame from '../createGame';
import addPlayerToGame from '../addPlayerToGame';
import { queryExistingGame, queryGamesOpened } from '../../utils/queries';
import { entries } from 'lodash';
import Button from '@mui/material/Button';
import { UserContext } from '../AuthenticationProvider';
import { Game } from '../../context/game/state';

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

type Move = 'X' | 'O';

const func = (move: Move) => {
    if (move === 'X') {
        //...get data
        return { name: 'Marko' };
    } else if (move === 'O') {
        //..get data
        return { name: 'Martina' };
    }
};

function GameComponent() {
    const db = getFirestore();
    const auth = getAuth();
    let navigate = useNavigate();

    const [board, setBoard] = useState<Game>(null);
    const [boardId, setBoardId] = useState('');

    let unsubFromCurrentGame: Unsubscribe = null;
    const [move, setMove] = useState<Move>(null);
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
    const UserEmail = useContext(UserContext);
    console.log('UserEmail in Game: ', UserEmail);

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

    const promenliva = useMemo(() => {
        return func(move).name;
    }, [move]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                //user is logged in
                console.log("There's a logged in user", user);
                const existingGamesSnap = await getDocs<Game>(queryExistingGame(user.uid)); //gets existing games with current user

                if (existingGamesSnap.empty) {
                    const gamesOpenedSnap = await getDocs<Game>(queryGamesOpened()); //gets existing games with 1 player
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
            unsubFromCurrentGame?.();
            unsubscribe();
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

    const logout = useCallback(() => {
        return async () => {
            await auth.signOut();
            navigate('/');
            if (boardId) {
                await deleteDoc(doc(db, 'boards', boardId));
            }
            unsubFromCurrentGame?.();
        };
    }, [auth, boardId, navigate, unsubFromCurrentGame]);

    return (
        <div>
            <div className="login">
                <Button variant="contained" onClick={logout}>
                    logout
                </Button>
            </div>
            <p className="description">Classic game for two players. O always starts.</p>
            <div>{promenliva}'s turn.</div>
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
            <div>Current user: {UserEmail}</div>
        </div>
    );
}

export default GameComponent;
