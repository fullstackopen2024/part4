const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  if (blogs === 'undefined') {
    return 0;
  }
  return blogs.length > 0
    ? blogs.map(blog => blog.likes).reduce((acc, curr) => acc + curr, 0)
    : 0;
}

const favoriteBlog = (blogs) => {
  if (blogs === 'undefined') {
    return undefined;
  }
  return blogs.length > 0
    ? blogs.reduce((acc, current) => current.likes > acc.likes ? current : acc, blogs[0])
    : undefined;
}

const mostBlogs = (blogs) => {
  if (blogs === 'undefined') {
    return undefined;
  }

  if (blogs.length === 0) {
    return undefined;
  }

  let listOfAuthors = {};
  blogs.forEach(blog => {
    if (listOfAuthors.hasOwnProperty(blog.author)) {
      listOfAuthors[blog.author]++
    } else {
      listOfAuthors[blog.author] = 1;
    }
  })

  let values = Object.values(listOfAuthors);
  let max = Math.max(...values);

  return {
    author: Object.keys(listOfAuthors).find(key => listOfAuthors[key] === max),
    blogs: max
  }
}

const mostLikes = (blogs) => {
  if (blogs === 'undefined') {
    return undefined;
  }

  if (blogs.length === 0) {
    return undefined;
  }

  let listOfAuthors = {};
  blogs.forEach(blog => {
    if (listOfAuthors.hasOwnProperty(blog.author)) {
      listOfAuthors[blog.author] += blog.likes;
    } else {
      listOfAuthors[blog.author] = blog.likes;
    }
  })

  let values = Object.values(listOfAuthors);
  let max = Math.max(...values);

  return {
    author: Object.keys(listOfAuthors).find(key => listOfAuthors[key] === max),
    likes: max
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}