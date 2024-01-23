const express = require('express')
const morgan = require('morgan')
const requestLogger = morgan('dev')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist')) // tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö pyynnön polkua vastaavan nimistä tiedostoa hakemistosta dist. Jos löytyy, palauttaa Express tiedoston.
app.use(express.json()) // Parse JSON request bodies
app.use(cors())
app.use(requestLogger)

// Define a custom token for logging POST request data
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '' // Return empty string for non-POST requests
})

// Use Morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(`Phonebook has info for ${count} people<br>${new Date()}`)
  })
})

// Route to fetch a single person by their ID
app.get('/api/persons/:id', (req, res) => {
  // Find a person by ID using Mongoose's findById
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person) // Send the found person as JSON
      } else {
        res.status(404).send('Person not found') // If no person found, send 404
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const { number } = request.body

  // Simple validation for number
  if (!number) {
    return response.status(400).json({ error: 'New number is required.' })
  }

  const update = { number }

  // Find the person by ID and update their number
  Person.findByIdAndUpdate(id, update, { new: true })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).json({ error: 'Person not found.' })
      }
      response.status(200).json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  // Simple validation for name and number
  if (!name || !number) {
    return response.status(400).json({ error: 'The name and number are required.' })
  }

  // Check if the name already exists in the database
  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        console.log('Name must be unique.')
        return response.status(400).json({ error: 'Name must be unique.' })
      }

      // Create a new person object with the request body
      const newPerson = new Person({
        name, // Name from the request body
        number // Number from the request body
      })

      // Save the new person to the database
      newPerson.save()
        .then(savedPerson => {
          response.status(201).json(savedPerson)
        })
        .catch(error => next(error)) // Pass errors to Express's default error handler
    })
    .catch(error => next(error)) // Error handling for findOne
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

morgan('tiny')

// pieeru
