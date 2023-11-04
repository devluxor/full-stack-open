import { useState } from 'react'

const BlogList = ({ blogs, likeBlog, deleteBlog, user }) => {
  if (!blogs) return

  return (
    <ul>
      {blogs.map(blog => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        )
      })}
    </ul>
  )
}

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
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
    <div className='blog' style={blogStyle}>
      <h5 style={{ display: 'inline-block' }}>{`${blog.title}`} by {`${blog.author}`} </h5>
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <BlogDetails
        blog={blog}
        visible={visible}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        user={user}
      ></BlogDetails>
    </div>
  )
}

const BlogDetails = ({ blog, visible, likeBlog, deleteBlog, user }) => {
  const [likes, setLikes] = useState(blog.likes)
  const creatorId = blog.user.id || blog.user
  const deleteVisible = creatorId === user.id

  const like = async () => {
    blog.likes += 1
    await likeBlog(blog)
    setLikes(likes + 1)
  }

  const delBlog = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      await deleteBlog(blog)
    }
  }

  if (!visible) return

  return (
    <>
      <p>{blog.url}</p>
      <p style={{ display: 'inline-block' }}>likes {likes}</p>
      <button className='like' onClick={like}>like</button>
      <p>{blog?.user?.username || blog.username}</p>
      {deleteVisible &&
        <button
          className='delete'
          onClick={delBlog}
        >delete</button>
      }
    </>
  )
}


export default BlogList