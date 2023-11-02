const Blog = require('../models/blog')
const User = require('../models/user')

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}