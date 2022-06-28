import { configureStore } from '@reduxjs/toolkit';
import GitReducer from './Git';
const store = configureStore({
    reducer: {
        Git: GitReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export default store;
