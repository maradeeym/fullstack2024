// AnecdoteForm.jsx
import { useDispatch } from 'react-redux';
import { addNewAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

 // AnecdoteForm.jsx
const addNewAnecdoteHandler = async (event) => {
  event.preventDefault();
  const content = event.target.anecdote.value;
  event.target.anecdote.value = '';
  dispatch(addNewAnecdote(content)); // This dispatches the async thunk
};

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdoteHandler}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
