import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { RootState } from './store';

const gameIdSlice = createSlice<string, SliceCaseReducers<string>>({
    name: 'gameId',
    initialState: null,
    reducers: {
        setGameId: (state, action) => {
            return action.payload;
        },
    },
});

export const { setGameId } = gameIdSlice.actions;
export const selectGameId = (state: RootState) => state.gameId;
export default gameIdSlice.reducer;
