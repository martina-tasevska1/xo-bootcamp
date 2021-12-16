import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import gameIdReducer from './gameIdSlice';
import moveReducer from './moveSlice';

const store = configureStore({
    reducer: {
        game: gameReducer,
        gameId: gameIdReducer,
        move: moveReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
