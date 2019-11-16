const express = require('express')
const fetch = require('node-fetch')
const envName = '.env' // to be updated
//const dotenv = require('dotenv').config('../envName)
//const port = process.env.PORT

const geoNamesUserName = 'tamas.dinh'
const geoNamesBaseURL = 'http://api.geonames.org'

const app = express()

app.use(express.static('dist'))

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/places', (req, res) => {
  
  let urlToUse = new URL(`${geoNamesBaseURL}/search`)
  const params = {
    name_startsWith: req.query.query,
    featureCode: 'PPL',
    isNameRequired: true,
    orderBy: 'relevance',
    username: geoNamesUserName
  }
  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
  urlToUse.searchParams.append('featureCode', 'PPLC')

  const headers = {
    'Accept': 'application/json'
  }

  fetch(urlToUse, {headers})
  .then(response => response.json())
  .then(response => {
    console.log(response)
    res.status(200).send(response)
  })
  .catch(e => {
    res.status(404).send(JSON.stringify({error: e}))
  })
})

app.listen(8081, () => {
  console.log(`Server online and listening on port ${8081}`)
})