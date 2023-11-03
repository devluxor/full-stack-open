const BlogList = ({blogs}) => {
  if (!blogs) return

  return (
    <ul>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
    </ul>
  )
}

const Blog = ({ blog }) => {
  return (
    <li>
      {blog.title}, by {blog.author}
    </li>
  )  
}


export default BlogList