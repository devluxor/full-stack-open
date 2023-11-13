import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import blogService from './services/blogs'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Toggable from './components/Toggable'
import Notification from './components/Notification'
import Users from './components/Users'
import UserDetails from './components/UserDetails'

import userService from './services/users'
import { setUser, clearUser } from './reducers/userReducer'

import { Link, Route, Routes, useMatch } from 'react-router-dom'

const App = () => {
  const [users, setUsers] = useState([])
  const user = useSelector(({ user }) => user )
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  useEffect(() => {
    userService.getUsers().then(u => setUsers(u))
  },[])

  const loadLoginForm = () => {
    return (
      <Toggable buttonLabel="log in">
        <LoginForm />
      </Toggable>
    )
  }


  const userDetailsMatch = useMatch('/users/:id')
  const userDetails = userDetailsMatch ?
    users.find(u => u.id === userDetailsMatch.params.id)
    : null

  const loadLoggedUser = () => {
    return (
      <>
        <Routes>
          <Route path='/users/:id' element ={<UserDetails userDetails={userDetails} />} />
          <Route path='/users' element={<Users />}/>
          <Route path='/' element={
            <>
              <Toggable buttonLabel="new blog" ref={blogFormRef}>
                <AddBlogForm ref={blogFormRef}/>
              </Toggable>
              <BlogList />
            </>
          }/>
        </Routes>
      </>
    )
  }

  const handleLogout = () => {
    dispatch(clearUser())
  }

  return (
    <div>
      {!user || <Navbar user={user} handleLogout={handleLogout}/>}
      <Header />
      <Notification />
      {user ? loadLoggedUser() : loadLoginForm()}
      <Footer />
    </div>
  )
}

const Header = () => {
  return <h2>Bloglist</h2>
}
const padding = {
  padding: 5
}
const Navbar = ({ user, handleLogout }) => {
  return (
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/users">users</Link>
      <p style={{ display: 'inline-block' }}>{user.name} logged in</p>
      <button style={{ display: 'inline-block' }} onClick={handleLogout}>logout</button>
    </div>
  )
}

const Footer = () => {
  return <h5>Lucas Sorribes 2023</h5>
}

export default App
