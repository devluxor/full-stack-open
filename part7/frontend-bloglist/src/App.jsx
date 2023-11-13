import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import blogService from './services/blogs'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Toggable from './components/Toggable'
import Notification from './components/Notification'

import { setUser, clearUser } from './reducers/userReducer'

const App = () => {
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

  const loadLoginForm = () => {
    return (
      <Toggable buttonLabel="log in">
        <LoginForm />
      </Toggable>
    )
  }

  const loadLoggedUserUI = () => {
    return (
      <>
        <h4>Hello {user.name}</h4>
        <button onClick={handleLogout}>logout</button>
        <Toggable buttonLabel="new blog" ref={blogFormRef}>
          <AddBlogForm ref={blogFormRef}/>
        </Toggable>
        <BlogList />
      </>
    )
  }

  const handleLogout = () => {
    dispatch(clearUser())
  }

  return (
    <div>
      <Header />
      <Notification />
      {user ? loadLoggedUserUI() : loadLoginForm()}
      <Footer />
    </div>
  )
}

const Header = () => {
  return <h2>Bloglist</h2>
}

const Footer = () => {
  return <h5>Lucas Sorribes 2023</h5>
}

export default App
