import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import popup from './popup';

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

export const store = configureStore({
    reducer: { 
        popup
    },
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
});