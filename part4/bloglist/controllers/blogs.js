const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

bloglistRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  console.log(response.body)
  response.status(201).json(savedBlog)
})

bloglistRouter.put('/:id', async (request, response) => {
  const blog = { likes: request.body.likes }
  
  const updatedBlog = await Blog.findByIdAndUpdate(
                        request.params.id,
                        blog,
                        { new: true, runValidators: true, context: 'query'}
                      )

  response.status(200).json(updatedBlog)
})

bloglistRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = bloglistRouter