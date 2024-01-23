// AnecdoteList.jsx
import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer'; // Adjust the path as necessary
import { notifyWithTimeout } from '../reducers/notificationReducer';
import Filter from './Filter'; // Import the Filter component
import Notification from './Notification';


const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const filter = useSelector(state => state.filter); // Get the current filter state
  const dispatch = useDispatch();

 const sortedAnecdotes = [...anecdotes]
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(String(filter).toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes); // Then sort them

    const vote = (id) => {
      const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id);
      if (votedAnecdote) {
        dispatch(voteAnecdote(votedAnecdote));
        dispatch(notifyWithTimeout(`You voted for '${votedAnecdote.content}'`, 5));
      }
    };
    
    
    
    
    

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
