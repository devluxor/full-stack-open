import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Toggable from './components/Toggable'
import Notification from './components/Notification'

import { setNotification } from './reducers/notificationReducer'
import { setUser, clearUser, logUser } from './reducers/userReducer'

import { 
  initializeBlogs, 
  createBlog, 
  deleteBlog as removeBlog,
  addLikeBlog as addLike
} from './reducers/blogsReducer'


const App = () => {
  const blogs = useSelector(({blogs}) => blogs)
  const user = useSelector(({user}) => user )


  const blogFormRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(initializeBlogs(blogs))
    })
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const loginUser = async (username, password) => {
    try {
      await dispatch(logUser({username, password}))
    } catch {
      displayNotification({ type: 'fail', message: 'Wrong credentials' })
    }
  }

  const displayNotification = (notification, delay = 4000) => {
    dispatch(setNotification(notification, delay))
  }

  const handleLogout = () => {
    dispatch(clearUser())
  }

  const loginForm = () => {
    return (
      <Toggable buttonLabel="log in">
        <LoginForm loginUser={loginUser} />
      </Toggable>
    )
  }

  const loggedUserUI = () => {
    return (
      <>
        <h4>Hello {user.name}</h4>
        <button onClick={handleLogout}>logout</button>
        <Toggable buttonLabel="new blog" ref={blogFormRef}>
          <AddBlogForm addBlog={addBlog} />
        </Toggable>
        <BlogList
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
      // setBlogs(sorted)
      dispatch(createBlog(addedBlog))
      displayNotification({
        type: 'success',
        message: `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
      })
      return addedBlog
    } catch (e) {
      throw Error(e)
    }
  }

  const likeBlog = async (blog) => {

    try {
      // await blogService.updateBlog(blog)
      dispatch(addLike(blog))
    } catch (e) {
  
      throw Error(e)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      // await blogService.deleteBlog(blog)
      // const newBloglist = filterDeleted(blog.id)
      // const sorted = sortByLikes(newBloglist)
      // setBlogs(sorted)
      dispatch(removeBlog(blog))
    } catch (e) {
      throw Error(e)
    }
  }

  // const filterDeleted = (idToDelete) => {
  //   return blogs.filter((blog) => {
  //     const blogId = blog.id
  //     return blogId !== idToDelete
  //   })
  // }

  // in decreasing order of likes
  const sortByLikes = (blogs) => {
    return [...blogs].sort((a, b) => b.likes - a.likes)
    // return blogs
  }

  return (
    <div>
      <Header />
      <Notification />
      {user ? loggedUserUI() : loginForm()}
      <Footer />
    </div>
  )
}

const Header = () => {
  return <h2>Bloglist</h2>
}

const Footer = () => {
  return <h2>Lucas Sorribes 2023</h2>
}

export default App
