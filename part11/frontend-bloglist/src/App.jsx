import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = sortByLikes(blogs)
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginUser = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch (exception) {
      displayNotification({ type: 'fail', message: 'Wrong credentials' })
    }
  }

  const displayNotification = (notification, delay=4000) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, delay)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const loginForm = () => {
    return (
      <Toggable buttonLabel='log in'>
        <LoginForm loginUser={loginUser}/>
      </Toggable>
    )
  }

  const loggedUserUI = () => {
    return (
      <>
        <h4>Hello {user.name}</h4>
        <button onClick={handleLogout}>logout</button>
        <Toggable buttonLabel='new blog' ref={blogFormRef}>
          <AddBlogForm addBlog={addBlog} />
        </Toggable>
        <BlogList
          blogs={blogs}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      </>
    )
  }

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.createBlog(newBlog)
      blogFormRef.current.toggleVisibility()
      const sorted = sortByLikes(blogs.concat(addedBlog))
      setBlogs(sorted)
      displayNotification({
        type: 'success',
        message: `a new blog ${addedBlog.title} by ${addedBlog.author} added`
      })
      return addedBlog
    } catch (e) {
      throw Error(e)
    }
  }

  const likeBlog = async (blog) => {
    try {
      await blogService.updateBlog(blog)
    } catch (e) {
      throw Error(e)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog)
      const newBloglist = filterDeleted(blog.id || blog._id)
      const sorted = sortByLikes(newBloglist)
      setBlogs(sorted)
    } catch (e) {
      throw Error(e)
    }
  }

  const filterDeleted = idToDelete => {
    return blogs.filter(blog => {
      const blogId = blog.id || blog._id
      return blogId !== idToDelete
    })
  }

  // in decreasing order of likes
  const sortByLikes = (blogs) => {
    return blogs.sort((a, b) => (b.likes - a.likes ))
  }

  return (
    <div>
      <Header/>
      <Notification notification={notification}/>
      {user ? loggedUserUI() : loginForm()}
    </div>
  )
}

const Header = () => {
  return <h2>Bloglist</h2>
}

const Notification = ({ notification }) => {
  if (!notification) return

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default App