const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'TESTBLOG-1',
    author: 'TEST AUTOR 1',
    url: 'URL',
    likes: 1
  },
  {
    title: 'TESTBLOG-2',
    author: 'TEST AUTOR 2',
    url: 'URL',
    likes: 1
  },
]

// const nonExistingId = async () => {
//   const note = new Blog({ content: 'willremovethissoon' })
//   await note.save()
//   await note.deleteOne()

//   return note._id.toString()
// }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}