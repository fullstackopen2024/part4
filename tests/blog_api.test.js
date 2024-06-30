const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('has unique property id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]

  assert.strictEqual(firstBlog.hasOwnProperty('id'), true)
})

test('new blog is created', async () => {
  const newBlog = {
    "title": "How to freelance",
    "author": "Vlad R",
    "url": "www.google.com",
    "likes": 20,
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const savedBlog = response.body.find(blog => blog.title === 'How to freelance')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert.strictEqual(savedBlog.hasOwnProperty('id'), true)
  delete savedBlog.id
  assert.deepStrictEqual(savedBlog, newBlog)
})

test('missing likes property defaults to zero', async () => {
  const missingLikes = {
    "title": "How to test node apps",
    "author": "Vlad R",
    "url": "www.fullstackopen.com",
  }

  await api.post('/api/blogs')
    .send(missingLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const savedBlog = response.body.find(blog => blog.title === 'How to test node apps')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert.strictEqual(savedBlog.hasOwnProperty('likes'), true)
  assert.strictEqual(savedBlog.likes, 0)
})

test('missing title for blog returns bad request', async () => {
  const missingTitle = {
    "author": "Vlad R",
    "url": "www.fullstackopen.com",
  }

  await api.post('/api/blogs')
    .send(missingTitle)
    .expect(400)

  const blogsInDatabase = await api.get('/api/blogs')
  assert.strictEqual(blogsInDatabase.body.length, initialBlogs.length)
})

test('missing url for blog returns bad request', async () => {
  const missingUrl = {
    "title": "How to test node apps",
    "author": "Vlad R",
  }

  await api.post('/api/blogs')
    .send(missingUrl)
    .expect(400)

  const blogsInDatabase = await api.get('/api/blogs')
  assert.strictEqual(blogsInDatabase.body.length, initialBlogs.length)
})

test('delete react patterns blogs is successful', async () => {
  const response = await api.get('/api/blogs')
  const reactPatternsBlog = response.body.find(blog => blog.title === 'React patterns')

  await api
    .delete(`/api/blogs/${reactPatternsBlog.id}`)
    .expect(204)

  const blogsAfterDeletion = await api.get('/api/blogs');
  assert.strictEqual(blogsAfterDeletion.body.length, initialBlogs.length - 1)
  assert.strictEqual(blogsAfterDeletion.body.find(blog => blog.title === 'React patterns'), undefined)
})

test('update a blog is successful', async () => {
  const response = await api.get('/api/blogs')
  const initialBlog = response.body[0];
  initialBlog.likes = 888

  await api
    .put(`/api/blogs/${initialBlog.id}`)
    .send(initialBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  let blogsAfterUpdate = await api.get('/api/blogs')
  blogsAfterUpdate = blogsAfterUpdate.body.map(blog => blog.likes)
  assert.strictEqual(blogsAfterUpdate.length, initialBlogs.length)
  assert.strictEqual(blogsAfterUpdate.includes(888), true)
})

after(async () => {
  await mongoose.connection.close()
})