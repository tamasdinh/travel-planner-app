const express = require('express')
const envName = '.env' // to be updated
//const dotenv = require('dotenv').config('../envName)
//const port = process.env.PORT

const app = express()

app.use(express.static('dist'))

app.listen(8081, () => {
  console.log(`Server online and listening on port ${8081}`)
})