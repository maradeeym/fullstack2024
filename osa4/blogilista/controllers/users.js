const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')

    response.json(users)
  })

  usersRouter.get('/:id', async (request, response) => {
    try {
      const user = await User.findById(request.params.id).populate('blogs');
      if (user) {
        response.json(user);
      } else {
        response.status(404).end(); // Not found if no user with this ID
      }
    } catch (error) {
      console.error(error);
      response.status(400).send({ error: 'malformatted id' }); // Bad request if invalid ID format
    }
  });

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;
  
   // Check if the username already exists
   const existingUser = await User.findOne({ username });
   if (existingUser) {
       return response.status(400).json({ error: 'Username already exists' });
   }

   // Validate password length
   if (password.length < 3) {
       return response.status(400).json({ error: 'Password must be at least 3 characters long' });
   }
   
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter