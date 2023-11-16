import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook' 
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import { Route, Routes, useNavigate} from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Recommendations from './components/Recommendations'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    window.localStorage.clear()
    client.resetStore()
    navigate('/')
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('library-user-token')
    if (loggedUser) setToken(loggedUser)
  }, [])
  
  return (
    <div>
      <Navbar userLoggedIn={token} logout={logout}/>
      <Routes>
          <Route path='/login'    
            element={token ? <Navigate replace to='/books'/> : <LoginForm setToken={setToken}/>}
          />
          <Route path='/authors'  element={< Authors userLoggedIn={token}/>}/>
          <Route path='/books'    element={< Books/>}/>
          <Route path='/recommendations'    element={< Recommendations/>}/>
          <Route path='/new_book' element={< NewBook/>}/>
          <Route path='/'         element={< Books/>}/>
      </Routes>
    </div>
  )
}



export default App
