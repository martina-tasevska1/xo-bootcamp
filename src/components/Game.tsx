import Field from './Field';
import {
    getFirestore,
    getDocs,
    doc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
    Unsubscribe,
    deleteDoc,
} from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import createGame from '../utils/createGame';
import addPlayerToGame from '../utils/addPlayerToGame';
import { queryExistingGame, queryGamesOpened } from '../utils/queries';
import { entries, size } from 'lodash';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Game } from '../context/game/state';
import { selectGame, setGame } from '../redux/gameSlice';
import store from '../redux/store';
import { gameConverter } from '../config/converters';

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

function GameComponent() {
    const db = getFirestore();
    const auth = getAuth();
    let navigate = useNavigate();

    // const { setGame, setGameId, setMove, move, gameId } = useGame();

    let unsubFromCurrentGame = useRef<Unsubscribe>(null);
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
    const dispatch = useDispatch();
    const game = useSelector(selectGame);

    const currentUserMove = useMemo(() => {
        return game?.players[auth.currentUser.uid];
    }, [game, auth]);

    const won = useMemo(() => {
        return checkWin(moves);
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
                const existingGamesSnap = await getDocs<Game>(queryExistingGame(user.uid)); //gets existing games with current user

                console.log('existing game', existingGamesSnap);

                if (existingGamesSnap.empty) {
                    const gamesOpenedSnap = await getDocs<Game>(queryGamesOpened()); //gets existing games with 1 player
                    if (gamesOpenedSnap.empty) {
                        let newGameDoc = await createGame(user.uid); //creates new game
                        unsubFromCurrentGame.current = listenToCurrentGame(user.uid, newGameDoc.id);
                        // setGame(newGameDoc);
                        // setGameId(newGameDoc.id);
                        // setMove('X');
                        dispatch(setGame(newGameDoc));
                    } else {
                        addPlayerToGame(user.uid, gamesOpenedSnap.docs[0].id); //adds player to existing game
                        unsubFromCurrentGame.current = listenToCurrentGame(
                            user.uid,
                            gamesOpenedSnap.docs[0].id
                        );
                        // setGame({
                        //     ...gamesOpenedSnap.docs[0].data(),
                        //     id: gamesOpenedSnap.docs[0].id,
                        // })
                        // setGameId(gamesOpenedSnap.docs[0].id);
                        // setMove('O');
                        dispatch(
                            setGame({
                                ...gamesOpenedSnap.docs[0].data(),
                                id: gamesOpenedSnap.docs[0].id,
                            })
                        );
                    }
                } else {
                    console.log('This user already has an active game');
                    unsubFromCurrentGame.current = listenToCurrentGame(
                        user.uid,
                        existingGamesSnap.docs[0].id
                    );
                    // setGame({
                    //     ...existingGamesSnap.docs[0].data(),
                    //     id: existingGamesSnap.docs[0].id,
                    // })
                    // setGameId(existingGamesSnap.docs[0].id);
                    dispatch(
                        setGame({
                            ...existingGamesSnap.docs[0].data(),
                            id: existingGamesSnap.docs[0].id,
                        })
                    );
                    console.log('existing', existingGamesSnap);
                }
            } else {
                console.log('Must be logged in to play');
            }
        });

        return () => {
            unsubFromCurrentGame.current?.();
            unsubscribe();
        };
    }, []);

    const message = useMemo(() => {
        if (!game) return null;
        if (won) return 'You won.';
        if (game?.totalPlayers === 1) return 'Waiting for another player';
        else return 'Two players active';
    }, [game, won]);

    const listenToCurrentGame = (userId: string, id: string) => {
        return onSnapshot(doc(db, 'boards', id).withConverter(gameConverter), drawBoard);
    };

    const drawBoard = (snapshot: DocumentSnapshot<DocumentData>) => {
        const game: Game = snapshot.data() as Game;
        if (game) {
            if (game.fields) {
                console.log('Game in drawBoard:', game);
                setFields(game.fields);
            }
            // setGame(game);
            store.dispatch(setGame(game));
        }
    };

    const logout = async () => {
        await auth.signOut();
        navigate('/');
        if (game.id) {
            await deleteDoc(doc(db, 'boards', game.id));
        }
        unsubFromCurrentGame.current?.();
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    backgroundColor: 'rgb(186, 202, 224)',
                    padding: '7px',
                }}
            >
                <Button variant="outlined" onClick={logout}>
                    logout
                </Button>
            </Box>
            <Box
                sx={{
                    fontSize: '30px',
                    marginTop: '50px',
                    textAlign: 'center',
                    fontFamily: 'Indie Flower, cursive',
                }}
            >
                Classic game for two players. O always starts.
            </Box>
            <Box
                sx={{
                    textAlign: 'center',
                    paddingTop: '20px',
                    fontFamily: 'Indie FLower, cursive',
                }}
            >
                {message}
            </Box>
            <Box sx={{ textAlign: 'center', fontFamily: 'Indie Flower, cursive' }}>
                You are {currentUserMove}
            </Box>
            <Box sx={{ textAlign: 'center', fontFamily: 'Indie Flower, cursive' }}>
                It's {game?.players[game?.turn]} turn
            </Box>
            <Box
                sx={{
                    width: '306px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplate: 'repeat(3, 100px) / repeat(3, 100px)',
                    gridGap: '3px',
                    backgroundColor: 'rgb(87, 110, 116)',
                    marginTop: '100px',
                }}
            >
                {entries(fields).map(([k, v]) => (
                    <Field key={k} moves={moves} setMoves={setMoves} id={`${k}`} value={v}></Field>
                ))}
            </Box>
        </Box>
    );
}

export default GameComponent;
