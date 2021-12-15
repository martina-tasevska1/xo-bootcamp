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
import { useEffect, useState, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import createGame from '../utils/createGame';
import addPlayerToGame from '../utils/addPlayerToGame';
import { queryExistingGame, queryGamesOpened } from '../utils/queries';
import { entries } from 'lodash';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Game } from '../context/game/state';
import { useGame } from '../context/game';


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

    const { setGame, setGameId, setMove, move, gameId } = useGame();
    
    const [showDiv, setShowDiv] = useState(false);
    const [divString, setDivString] = useState("")

    let unsubFromCurrentGame: Unsubscribe = null;
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

    useEffect(() => {
        let win = checkWin(moves);
        if (win) {
            console.log(`${move} won!`);
            // window.alert(`${move} won!`);
            displayDiv(`${move} won!`)
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

    function displayDiv(divString: string){
        setShowDiv(true);
        setDivString(divString);
    }

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
                        listenToCurrentGame(user.uid, newGameDoc.id);
                        setGame(newGameDoc);
                        setGameId(newGameDoc.id);
                        setMove('X');
                        displayDiv("Waiting for second player.");

                    } else {
                        addPlayerToGame(user.uid, gamesOpenedSnap.docs[0].id); //adds player to existing game
                        listenToCurrentGame(user.uid, gamesOpenedSnap.docs[0].id);
                        setGame({
                            ...gamesOpenedSnap.docs[0].data(),
                            id: gamesOpenedSnap.docs[0].id,
                        })
                        setGameId(gamesOpenedSnap.docs[0].id);
                        setMove('O');
                        displayDiv("Two players active.");
                    }
                } else {
                    console.log('This user already has an active game');
                    listenToCurrentGame(user.uid, existingGamesSnap.docs[0].id);
                    setGame({
                        ...existingGamesSnap.docs[0].data(),
                        id: existingGamesSnap.docs[0].id,
                    })
                    setGameId(existingGamesSnap.docs[0].id);
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
        if (game) {
            if (game.fields) {
                console.log('Game in drawBoard:', game);
                setFields(game.fields);
            }
            setGame(game);
            if(game.totalPlayers == 2){
                displayDiv("Two players active");
            }
        }
        
    };

    const logout = async () => {
        await auth.signOut();
        navigate('/');
        if (gameId) {
            await deleteDoc(doc(db, 'boards', gameId));
        }
        unsubFromCurrentGame?.();

    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'right', backgroundColor: 'rgb(186, 202, 224)', padding: '7px'}}>
                <Button variant="outlined" onClick={logout}>
                    logout
                </Button>
            </Box>
            <Box sx={{ fontSize: '30px', marginTop: '50px', textAlign: 'center', fontFamily: 'Indie Flower, cursive'}}>Classic game for two players. O always starts.</Box>
            {
                showDiv && 
                    <Box sx={{ textAlign: 'center', paddingTop: '20px', fontFamily: 'Indie FLower, cursive' }}>
                    { divString }
                    </Box>
                
            }
            <Box sx={{ textAlign: 'center', fontFamily: 'Indie Flower, cursive' }}>
                You are {move}
            </Box>
            <Box sx={{ width: '306px', margin: '0 auto', display: 'grid', gridTemplate: 'repeat(3, 100px) / repeat(3, 100px)', gridGap: '3px', backgroundColor: 'rgb(87, 110, 116)', marginTop: '100px'}}>
                {entries(fields).map(([k, v]) => (
                    <Field
                        key={k}
                        moves={moves}
                        setMoves={setMoves}
                        move={move}
                        id={`${k}`}
                        value={v}
                        
                    ></Field>
                ))}
            </Box>
        </Box>
    );
}

export default GameComponent;
