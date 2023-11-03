import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setURL] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
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
        <AddBlogForm 
          addBlog={addBlog}
          title={title}
          author={author}
          url={url}
          handleInputChange={handleInputChange}
        />
      </>
    )
  }

  const addBlog = async (event) => {
    event.preventDefault()
    
    const newBlog = {
      title,
      author,
      url
    }

    try {
      const addedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(addedBlog))
      resetInputs()
    } catch (e) {
      throw Error(e)
    }
  }

  const resetInputs = () => {
    setAuthor('')
    setTitle('')
    setURL('')
  }

  const handleInputChange = (event) => {
    const input = event.target
    switch(input.name) {
      case 'title':
        setTitle(input.value)
        break
      case 'author':
        setAuthor(input.value)
        break
      case 'url':
        setURL(input.value)
        break
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      {user ? loggedUserUI() : loginForm()}
    </div>
  )
}

export default App