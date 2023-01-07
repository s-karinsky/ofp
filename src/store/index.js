import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import cart from './cart';
import popup from './popup';
import profile from './profile';

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

export const store = configureStore({
    reducer: { 
        cart,
        popup,
        profile
    },
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
});