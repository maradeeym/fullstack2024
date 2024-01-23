import { configureStore } from '@reduxjs/toolkit';
import anecdoteReducer, { initializeAnecdotes } from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  }
});

// Dispatch the action to initialize anecdotes
store.dispatch(initializeAnecdotes());

export default store;
