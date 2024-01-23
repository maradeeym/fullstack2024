// App.jsx
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList'; // Import the new component

const App = () => {

  return (
    <div>
      <AnecdoteList /> {/* Use the AnecdoteList component */}
      <AnecdoteForm />
    </div>
  );
};

export default App;