import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs, addLikeBlog as like, deleteBlog as deleteB } from '../reducers/blogsReducer'
import blogService from '../services/blogs'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user )
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(initializeBlogs(blogs))
    })
  }, [dispatch])

  if (!blogs) return

  return (
    <ul className="bloglist">
      {blogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
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
    marginRight: 20,
  }

  return (
    <div className="blog" style={blogStyle} id={blog.title}>
      <h5 style={{ display: 'inline-block' }}>
        {`${blog.title}`} by {`${blog.author}`}{' '}
      </h5>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
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

const BlogDetails = ({ blog, visible, user }) => {
  const [likes, setLikes] = useState(blog.likes)
  const creatorId = blog.user.id || blog.user
  const deleteVisible = creatorId === user.id

  const dispatch = useDispatch()

  const likeBlog = async () => {
    try {
      await dispatch(like(blog))
      setLikes(likes + 1)
    } catch (e) {
      throw Error(e)
    }
  }

  const deleteBlog = async () => {
    try {
      await dispatch(deleteB(blog))
    } catch (e) {
      throw Error(e)
    }
  }

  if (!visible) return

  return (
    <>
      <p>{blog.url}</p>
      <p style={{ display: 'inline-block' }}>likes {likes}</p>
      <button className="like" onClick={likeBlog}>
        like
      </button>
      <p>{blog?.user?.username || blog.username}</p>
      {deleteVisible && (
        <button className="delete" onClick={deleteBlog}>
          delete
        </button>
      )}
    </>
  )
}

export default BlogList
