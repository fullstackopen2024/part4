const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { request, response } = require("express");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const toUpdateBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(toUpdateBlog.id, toUpdateBlog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter