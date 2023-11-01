const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have a unique id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
  })

  expect(blogs[0].id).not.toMatch(blogs[1].id)
})

// making an HTTP POST request to the /api/blogs URL successfully creates a new blog post. 
// At the very least, verify that the total number of blogs in the system is increased by one. 
// You can also verify that the content of the blog post is saved correctly to the database.
test('a valid blog is created', async () => {
  const testTitle = 'TESTBLOG-3'
  const newBlog =   {
    title: testTitle,
    author: 'TEST AUTOR 3',
    url: 'URL',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const afterBlogs = await helper.blogsInDb()
  expect(afterBlogs).toHaveLength(helper.initialBlogs.length + 1)

  const contents = afterBlogs.map(b => b.title)
  expect(contents).toContain(testTitle)
})


afterAll(async () => {
  await mongoose.connection.close()
})