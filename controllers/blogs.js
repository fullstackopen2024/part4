const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id

  const blog = await Blog.findById(blogId)
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'you cannot delete a blog you do not own' })
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const toUpdateBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(toUpdateBlog.id, toUpdateBlog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter