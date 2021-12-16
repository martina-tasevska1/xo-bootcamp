import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { RootState } from './store';

const moveSlice = createSlice<string, SliceCaseReducers<string>>({
    name: 'move',
    initialState: null,
    reducers: {
        setMove: (state, action) => {
            return action.payload;
        },
    },
});

export const { setMove } = moveSlice.actions;
export const selectMove = (state: RootState) => state.move;
export default moveSlice.reducer;
