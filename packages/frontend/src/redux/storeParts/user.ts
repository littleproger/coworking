import { createSlice } from '@reduxjs/toolkit';
import type * as Common from '@coworking/common';

import type { RootState } from '../store';

export type IUser = Common.Services.users.User;

export interface IState {
  authenticated: boolean | null;
  data: IUser | null;
}

const initialState: IState = {
  authenticated: null,
  data: null,
};

type AuthenticateAction = {
  payload: {
    data: NonNullable<IState['data']>;
  };
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticate: (state, action: AuthenticateAction) => {
      const { data } = action.payload;

      state.authenticated = true;

      state.data = { ...data };
    },
    setUserData: (state, action: { payload: IUser }) => {
      state.data = action.payload;
    },
    logout: (state) => {
      state.authenticated = false;
      state.data = null;
      localStorage.removeItem('feathers-jwt');
    },
  },
});

export const {
  authenticate,
  setUserData,
  logout,
} = slice.actions;

export const getAuthenticated = (state: RootState) => state.user.authenticated;
export const getData = (state: RootState):IState['data'] => state.user.data;

export const reducer = slice.reducer;
