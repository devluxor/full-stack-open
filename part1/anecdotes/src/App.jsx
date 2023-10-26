import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const generateRandomIndex = () => Math.floor(Math.random() * anecdotes.length)
   
  const [selected, setSelected] = useState(generateRandomIndex())
  const [votes, setVotes] = useState(0)

  const [points, setPoints] = useState(anecdotes.reduce((points, _, i) => {
    points[i] = 0
    return points
  }, {}))

  const nextAnecdote = () => {
    setSelected(generateRandomIndex())
  }

  const voteAnecdote = (anecdoteIndex) => {
    let updatedPoints = {}
    updatedPoints[anecdoteIndex] = points[anecdoteIndex] + 1
    setPoints({...points, ...updatedPoints})
    setVotes(votes + 1)
  }

  const topAnecdote = () => {
    const mostVotes = maxVotes()
    const index = Object.keys(points).find(k => points[k] === mostVotes)
    return anecdotes[index]
  }

  const maxVotes = () => {
    return Math.max(...Object.values(points))
  }

  console.log(points)

  return (
    <div>
      <Title text='Anecdote of the day' />
      <Anecdote text={anecdotes[selected]} points={points[selected]}/>

      <Button handleClick={nextAnecdote} text={'next anectode'} />
      <Button handleClick={voteAnecdote} anecdoteIndex={selected} text={'vote anecdote'} />

      <Title text='Anecdote with most votes' />
      <Anecdote text={topAnecdote()} points={maxVotes()} voted={votes > 0}/>

    </div>
  )
}

const Title = ({text}) => <h1>{text}</h1>

const Anecdote = ({text, points, voted=true}) => {
  if (!voted) return <h4>No votes yet!</h4>

  return (
    <>
      <h4>{text}</h4>
      <h5>This anecdote has {points} {points > 1 ? 'votes' : `vote`}</h5>
    </>
  )
}

const Button = ({text, handleClick, anecdoteIndex=undefined}) => {
  return (
    <button onClick={() => handleClick(anecdoteIndex)}>
      {text}
    </button>
  )
}

export default App