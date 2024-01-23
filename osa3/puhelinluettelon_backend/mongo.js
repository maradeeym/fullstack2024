const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]

const url =
  `mongodb+srv://serkkupoika:${password}@cluster0.sgksjwl.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{7}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Print the database
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person.name + ' ' + person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  // Add a new person
  const nameArg = process.argv[3]
  const numberArg = process.argv[4]

  const person = new Person({
    name: nameArg,
    number: numberArg
  })

  person.save().then(result => {
    console.log(`added ${nameArg} number ${numberArg} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // Incorrect number of arguments
  console.log('Usage: node mongo.js <password> [name] [number]')
  mongoose.connection.close()
  process.exit(1)
}
