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