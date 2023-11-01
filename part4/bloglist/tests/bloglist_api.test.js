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


test('a valid blog is created', async () => {
  const newBlog =   {
    title: 'TESTBLOG-3',
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
  expect(contents).toContain(newBlog.title)
})

test('likes property defaults to 0', async () => {
  const newBlog = {
    title: 'TESTBLOG-3',
    author: 'TEST AUTOR 3',
    url: 'URL'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const results = await Blog.find({title: newBlog.title})
  expect(results[0].likes).toBe(0)
})

test('new blog is not added if title is missing', async () => {
  const newBlog = {
    author: 'TEST AUTOR 3',
    url: 'URL',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('new blog is not added if url is missing', async () => {
  const newBlog = {
    title: 'TESTBLOG-3',
    author: 'TEST AUTOR 3',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog is deleted', async () => {
  const blogs = await helper.blogsInDb()
  const id = blogs[0].id

  await api
    .delete(`/api/blogs/${id}`)
    .send()
    .expect(204)

  const afterDeletion = await helper.blogsInDb()

  expect(afterDeletion).toHaveLength(helper.initialBlogs.length - 1)
})

// updated number of likes
test('a blog number of likes is updated', async () => {
  let blogs = await helper.blogsInDb()
  const toUpdateBlog = blogs[0]
  const blogId = toUpdateBlog.id
  const newLikes = toUpdateBlog.likes + 1

  await api
    .put(`/api/blogs/${blogId}`)
    .send({ likes: newLikes })
    .expect(200)

  blogs = await helper.blogsInDb()
  const updatedBlog = blogs.find(b => b.id === blogId)
  expect(updatedBlog.id).toBe(blogId)
  expect(updatedBlog.likes).toBe(newLikes)
})

afterAll(async () => {
  await mongoose.connection.close()
})