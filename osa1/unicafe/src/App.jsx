import { useState } from 'react'

const Statistics = ({ name, stat }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{stat}</td>
    </tr>
  )
}


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good +1)} text="good" />
      <Button handleClick={() => setNeutral(neutral +1)} text="neutral" />
      <Button handleClick={() => setBad(bad +1)} text="bad" />
      <h2>statistics</h2>
      {(good === 0 && neutral === 0 && bad === 0) ? (
      <p>No feedback given</p>
    ) : (
      <table>
        <tbody>
          <Statistics name="good" stat={good} />
          <Statistics name="neutral" stat={neutral} />
          <Statistics name="bad" stat={bad} />
        </tbody>
      </table>
    )}
    </div>
  )
}

export default App