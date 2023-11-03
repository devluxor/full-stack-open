import { useState } from "react"

const BlogList = ({blogs}) => {
  if (!blogs) return

  return (
    <ul>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
    </ul>
  )
}

const Blog = ({ blog }) => {
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
        <h5 style={{display: 'inline-block'}}>{`${blog.title}`} by {`${blog.author}`}</h5> 
        <button onClick={() => setVisible(!visible)}>view</button>
        <BlogDetails
          blog={blog}
          visible={visible}
        ></BlogDetails>
      </div>
    </div>
  )  
}

const BlogDetails = ({blog, visible}) => {
  if (!visible) return
  return (
    <>
      <p>{blog.url}</p>
      <p>likes {blog.likes}</p>
      <p>{blog.user.username}</p>
    </>
  )
}


export default BlogList