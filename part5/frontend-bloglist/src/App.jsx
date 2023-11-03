import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async () => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user) 
      setUsername('')
      setPassword('')
    } catch (exception) {
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      console.log(exception)
      setPassword('')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const loginForm = () => {
    return (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    )
  }

  const loggedUserUI = () => {
    return (
      <>
        <h4>Hello {user.name}</h4>
        <button onClick={handleLogout}>logout</button>
        <BlogList blogs={blogs}/>
      </>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      {!user && loginForm()}
      {user && loggedUserUI()}
    </div>
  )
}

export default App