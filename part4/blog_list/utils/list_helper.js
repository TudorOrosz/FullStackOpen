  const listWithManyBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

// Libraries
const _ = require('lodash');

// Functions
const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blog_list) => {
  if (!Array.isArray(blog_list) || blog_list.length === 0) {
    return 0
  } 
  return blog_list.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blog_list) => {
  if (blog_list.length === 0) return null;
  return blog_list.reduce((max, blog) => 
    (max.likes || 0) > (blog.likes || 0) ? max : blog);
}

const mostBlogs = (blog_list) => {
  const counts = _.countBy(blog_list, 'author');
  const topEntry = _.maxBy(Object.entries(counts), ([author, count]) => count);
  return topEntry
    ? { author: topEntry[0], blogs: topEntry[1] }
    : null;
};

const mostLikes = (blog_list) => {
  const likesPerAuthor = blog_list.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + (blog.likes || 0);
    return acc;
  }, {});
  const topEntry = _.maxBy(Object.entries(likesPerAuthor), ([author, likes]) => likes);
  return topEntry
    ? { author: topEntry[0], likes: topEntry[1] }
    : null;
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}