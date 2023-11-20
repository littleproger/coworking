import { configureStore } from '@reduxjs/toolkit';

import * as storeParts from './storeParts';

const store = configureStore({
  reducer: {
    user: storeParts.user.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
