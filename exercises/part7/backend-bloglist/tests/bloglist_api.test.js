const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.testUserPassword, 10)
  const user = new User({ 
    username: helper.testUserName,
    passwordHash
  })

  await user.save()
})

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
  const loginRequest = await api
    .post('/api/login')
    .send({
      username: helper.testUserName,
      password: helper.testUserPassword
    })
    .expect(200)

  const token = loginRequest.body.token

  const newBlog =   {
    title: 'TESTBLOG-3',
    author: 'TEST AUTOR 3',
    url: 'URL',
    likes: 1
  }

  const result = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const afterBlogs = await helper.blogsInDb()
  expect(afterBlogs).toHaveLength(helper.initialBlogs.length + 1)

  const contents = afterBlogs.map(b => b.title)
  expect(contents).toContain(newBlog.title)
})

test('a blog without a token is not created', async () => {
  await api
    .post('/api/login')
    .send({
      username: helper.testUserName,
      password: helper.testUserPassword
    })
    .expect(200)

  const newBlog =   {
    title: 'TESTBLOG-3',
    author: 'TEST AUTOR 3',
    url: 'URL',
    likes: 1
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const afterBlogs = await helper.blogsInDb()
  expect(afterBlogs).toHaveLength(helper.initialBlogs.length)
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('users with invalid name are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '1',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)

    expect(result.body.error).toContain('User validation failed')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('users with invalid password are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'luke',
      name: 'Matti Luukkainen',
      password: '1',
    }

    const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)

    expect(result.body.error).toContain('invalid password')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  // delete test user
  await User.deleteMany({})
  await Blog.deleteMany({})

  await mongoose.connection.close()
})