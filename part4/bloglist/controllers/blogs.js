const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = { likes: request.body.likes }
  
  const updatedBlog = await Blog.findByIdAndUpdate(
                        request.params.id,
                        blog,
                        { new: true, runValidators: true, context: 'query'}
                      )

  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const parameterId = request.params.id
  const blog = await Blog.findById(parameterId)

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'unauthorized user'})
  }
  
  await blog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter