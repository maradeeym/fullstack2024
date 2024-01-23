const AnecdoteForm = ({ onSubmit }) => {

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onSubmit}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
