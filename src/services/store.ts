import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import burgerConstructor from './slices/burgerConstructorSlice';
import feeds from './slices/feedsSlice';
import ingredients from './slices/ingredientsSlice';
import order from './slices/orderSlice';
import user from './slices/userSlice';

export const rootReducer = combineReducers({
  burgerConstructor,
  feeds,
  ingredients,
  order,
  user
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

type TApplicationActions = any;

export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  TApplicationActions
>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
