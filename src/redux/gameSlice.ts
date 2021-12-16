import { RootState } from './store';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { Game } from '../context/game/state';

const gameSlice = createSlice<Game, SliceCaseReducers<Game>>({
    name: 'game',
    initialState: null,
    reducers: {
        setGame: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setGame } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game;
export default gameSlice.reducer;
