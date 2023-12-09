import { useState } from 'react'

import About from './components/About'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import Footer from './components/Footer'
import Anecdote from './components/Anecdote'
import Notification from './components/Notification'

import initialAnecdotes from './anecdotes'

import { Routes, Route, useMatch } from 'react-router-dom'

const App = () => {
  const [anecdotes, setAnecdotes] = useState(initialAnecdotes)
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    notify(`A new anecdote ${anecdote.content} created!`)
  }

  const notify = (message, ms=5000) => {
    setNotification(message)
    setTimeout(() => setNotification(''), ms)
  }

  const anecdoteById = (id) => {
    return anecdotes.find(a => a.id === id)
  }

  // const vote = (id) => {
  //   const anecdote = anecdoteById(id)
  //   const voted = {
  //     ...anecdote,
  //     votes: anecdote.votes + 1
  //   }
  //   setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  // }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
  ? anecdoteById(Number(match.params.id))
  : null
  
  return (
    <div className='container'>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification}/>
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/create" element={ <CreateNew addNew={addNew} /> } />
        <Route path="/about" element={ <About />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
      </Routes>     

      <Footer />
    </div>
  )
}

export default App
