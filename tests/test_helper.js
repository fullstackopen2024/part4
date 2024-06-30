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

const initialUsers = [
  {
    "username": "vlad101vlad",
    "name": "Vlad Rares",
    "password": "newpassword"
  },
  {
    "username": "razvan101stefan",
    "name": "Razvan Rares",
    "password": "somepassword"
  }
]

module.exports = {
  initialBlogs, initialUsers
}
