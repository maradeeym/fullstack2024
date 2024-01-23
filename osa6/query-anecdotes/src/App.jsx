import React, { useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'

const initialState = {
  message: '',
  visible: false
};


const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { ...state, message: action.message, visible: true };
    case 'HIDE_NOTIFICATION':
      return { ...state, message: '', visible: false };
    default:
      return state;
  }
};

const App = () => {

  const [notificationState, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    if (notificationState.visible) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notificationState]);
  
const queryClient = useQueryClient()

const newAnecdoteMutation = useMutation(createAnecdote, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  },
})

const addAnecdote = async (event) => {
  event.preventDefault();
  const content = event.target.anecdote.value;
  event.target.anecdote.value = '';

   // Check if the content is less than 5 characters
   if (content.length < 5) {
    // Dispatch a notification for invalid input
    dispatch({ type: 'SHOW_NOTIFICATION', message: 'Anecdotes must be 5 or more characters' });
    return; // Exit the function
  }

  const newAnecdote = { content, votes: 0 };
  newAnecdoteMutation.mutate(newAnecdote, {
    onSuccess: () => {
      dispatch({ type: 'SHOW_NOTIFICATION', message: `Anecdote '${content}' added` });
    }
  });
};


const voteMutation = useMutation(updateAnecdote, {
  onSuccess: () => {
    // Refetch anecdotes after a vote to update the list
    queryClient.invalidateQueries(['anecdotes']);
  },
});


const handleVote = (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
  voteMutation.mutate(updatedAnecdote, {
    onSuccess: () => {
      dispatch({ type: 'SHOW_NOTIFICATION', message: `Anecdote '${anecdote.content}' voted` });
    }
  });
};


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    console.log(result.error.message);
    return <div>anecdote service not available due to problems in server</div>;
}

  const anecdotes = result.data

  const notificationStyle = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: notificationState.visible ? 'block' : 'none'
  };

  return (
    <div>
      <h3>Anecdote app</h3>
      <div style={notificationStyle}>
        {notificationState.message}
      </div>
      <AnecdoteForm onSubmit={addAnecdote} />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
// muuttuuko tää
export default App
