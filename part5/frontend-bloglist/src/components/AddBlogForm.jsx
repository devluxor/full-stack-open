const AddBlogForm = ({addBlog, title, author, url, handleInputChange}) => {
  return (
    <form onSubmit={addBlog}>
      <Input value={title} name='title' handler={handleInputChange}/>
      <Input value={author} name='author' handler={handleInputChange}/>
      <Input value={url} name='url' handler={handleInputChange}/>
      <button type="submit">Add new blog</button>
    </form>
  )
}

const Input = ({value, name, handler}) => {
  const placeholder = `${name.charAt(0).toUpperCase()}${name.slice(1)}...`

  return (
    <input
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={handler}
    ></input>
  )
}

export default AddBlogForm