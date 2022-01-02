require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const { responseHandler } = require('./utilities/responseHandler')

//middleware
app.use(express.urlencoded({
    extended: true
}))

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI, (error) => {
    // eslint-disable-next-line no-unused-expressions
    error
      ? console.log(`Error connecting to databse /n ${error}`)
      : console.log(`Successfully connected to the database`);
  });


//ROUTES   
app.use('/user', require('./routes/userRoutes'))
app.get('/', (req, res) => {
    return responseHandler(res,'Server is running', 200, '', false)
})

//server
app.listen(4000 || process.env.PORT, () => {
    console.log('Server is up')
})