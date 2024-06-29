const dummy = (blogs) => {
  return 1;
}

const totalLikes =  (blogs) => {
  if (blogs === 'undefined') {
    return 0;
  }
  return blogs.length > 0
    ? blogs.map(blog => blog.likes).reduce((acc, curr) => acc + curr, 0)
    : 0;
}

module.exports = {
  dummy, totalLikes
}