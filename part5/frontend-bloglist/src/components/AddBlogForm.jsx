import { useState } from 'react'

const AddBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const createBlog = async (e) => {
    e.preventDefault()

    const newBlog = { title, author, url }

    const success = await addBlog(newBlog)
    if (success) {
      setAuthor('')
      setTitle('')
      setURL('')
    }
  }

  return (
    <>
      <h4>Create new</h4>
      <form onSubmit={createBlog}>
        <Input value={title} name='title' handler={setTitle}/>
        <Input value={author} name='author' handler={setAuthor}/>
        <Input value={url} name='url' handler={setURL}/>
        <button type="submit">Add new blog</button>
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
      onChange={e => handler(e.target.value)}
    ></input>
  )
}

export default AddBlogForm