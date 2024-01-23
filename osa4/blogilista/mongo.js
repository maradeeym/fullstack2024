const mongoose = require('mongoose')

const mongoUrl = `mongodb+srv://serkkupoika:serkkupoika@cluster0.sgksjwl.mongodb.net/blogilista?retryWrites=true&w=majority`

mongoose.connect(mongoUrl)

module.exports = mongoose
