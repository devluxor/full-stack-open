import { useState, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogsReducer'

const AddBlogForm = () => { 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')
  const dispatch = useDispatch()

  const addBlog = async (e) => {
    e.preventDefault()

    const newBlog = { title, author, url }
    try {
      await dispatch(createBlog(newBlog))
      setAuthor('')
      setTitle('')
      setURL('')
      document.getElementById('visibility-cancel').click()
      dispatch(setNotification({
        type: 'success',
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      }))
    } catch (e) {
      throw Error(e)
    }
  }

  return (
    <>
      <h4>Create new</h4>
      <form onSubmit={addBlog}>
        <Input value={title} name="title" handler={setTitle} />
        <Input value={author} name="author" handler={setAuthor} />
        <Input value={url} name="url" handler={setURL} />
        <button className="add-blog" type="submit">
          Add new blog
        </button>
      </form>
    </>
  )
}


const Input = ({ value, name, handler }) => {
  const placeholder = `${name.charAt(0).toUpperCase()}${name.slice(1)}...`

  return (
    <input
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={(e) => handler(e.target.value)}
    ></input>
  )
}

export default AddBlogForm
