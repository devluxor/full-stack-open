import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteFilter from './components/AnecdoteFilter'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <Notification/>
      <AnecdoteFilter/>
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App