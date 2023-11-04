import { useState } from "react"

const BlogList = ({blogs, likeBlog}) => {
  if (!blogs) return

  return (
    <ul>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} likeBlog={likeBlog} /> )}
    </ul>
  )
}

const Blog = ({ blog, likeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    marginRight: 20
  }

  return (
    <div style={blogStyle}>
      <div>
        <h5 style={{display: 'inline-block'}}>{`${blog.title}`} by {`${blog.author}`} </h5> 
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
        <BlogDetails
          blog={blog}
          visible={visible}
          likeBlog={likeBlog}
        ></BlogDetails>
      </div>
    </div>
  )  
}

const BlogDetails = ({blog, visible, likeBlog}) => {
  const [likes, setLikes] = useState(blog.likes)

  const like = async () => {
    await likeBlog(blog)
    blog.likes += 1
    setLikes(likes + 1)
  }

  if (!visible) return

  return (
    <>
      <p>{blog.url}</p>
      <p style={{display: 'inline-block'}}>likes {likes}</p> 
      <button onClick={like}>like</button>
      <p>{blog?.user?.username || blog.username}</p>
    </>
  )
}


export default BlogList