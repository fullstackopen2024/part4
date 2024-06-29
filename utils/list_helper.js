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

module.exports = {
  dummy, totalLikes, favoriteBlog
}