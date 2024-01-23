import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

export const initializeAnecdotes = createAsyncThunk(
  'anecdotes/initializeAnecdotes',
  async () => await anecdoteService.getAll()
);

export const addNewAnecdote = createAsyncThunk(
  'anecdotes/addNewAnecdote',
  async (content) => await anecdoteService.createNew(content)
);

export const voteAnecdote = createAsyncThunk(
  'anecdotes/voteAnecdote',
  async (anecdote) => {
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1};
    return await anecdoteService.update(anecdote.id, updatedAnecdote);
  }
);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // Reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAnecdotes.fulfilled, (state, action) => action.payload)
      .addCase(addNewAnecdote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(voteAnecdote.fulfilled, (state, action) => {
        const index = state.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  },
});

export default anecdoteSlice.reducer;