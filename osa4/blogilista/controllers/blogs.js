const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user'); // Import the User model
const jwt = require('jsonwebtoken');

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(401).json({ error: 'user not found' });
    }

    const blog = new Blog({
      ...request.body,
      user: user._id // Associate blog with user
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id); // Add blog to user's blogs
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body; // Destructure likes from the request body
  
    try {
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
      }
  
      // Update the likes
      blog.likes = likes;
  
      // Save the updated blog and return it
      const updatedBlog = await blog.save();
      response.json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog:', error);
      response.status(400).json({ error: 'malformatted id or other error' });
    }
  });

blogsRouter.delete('/:id', async (request, response) => {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
      }
  
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
      }
  
      if (blog.user.toString() !== decodedToken.id) {
        return response.status(401).json({ error: 'only the creator can delete a blog' });
      }
  
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  });
  
  

module.exports = blogsRouter;
