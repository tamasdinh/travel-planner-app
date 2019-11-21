const express = require('express')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
dotenv.config('./.env')
const port = process.env.PORT

const geoNamesBaseURL = 'http://api.geonames.org'
const geoNamesUserName = process.env.GEONAMES_USERNAME

const pixaBayBaseURL = 'https://pixabay.com'
const pixaBayAPIKey = process.env.PIXABAY_APIKEY

const darkSkyBaseURL = 'https://api.darksky.net'
const darkSkyAPIKey = process.env.DARKSKY_APIKEY

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
    name_startsWith: req.query.nameStartsWith,
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
    res.status(200).send(response)
  })
  .catch(e => {
    res.status(404).send(JSON.stringify({error: e}))
  })
})

app.get('/photos', (req, res) => {

  let urlToUse = new URL(`${pixaBayBaseURL}/api`)
  const params = {
    key: pixaBayAPIKey,
    lang: 'en',
    image_type: 'photo',
    category: 'travel,nature,places,buildings',
    editors_choice: true,
    safesearch: true,
    order: 'popular',
    per_page: 30,
    q: req.query.q
  }
  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))

  fetch(urlToUse)
  .then(response => response.json())
  .then(response => {
    if (response.totalHits == 0) {
      urlToUse = new URL(`${pixaBayBaseURL}/api`)
      params.q = req.query.q.split(',')[1]
      Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
      fetch(urlToUse)
      .then(response => response.json())
      .then(response => res.status(200).send(JSON.stringify({entity: params.q, response: response})))
    } else {
      res.status(200).send(JSON.stringify({entity: params.q, response: response}))
    }
  })
  .catch(e => {
    res.status(404).send(JSON.stringify({error: e}))
  })
})

app.get('/weather', (req, res) => {
  const lat = req.query.lat
  const long = req.query.long
  const startDate = req.query.startDate
  const duration = req.query.duration
  
  const params = {
    exclude: 'minutely,hourly,alerts,flags',
    units: 'si'
  }
  
  let fetchArray = []
  let runningDate = new Date(parseInt(startDate))
  
  for (let i = 0; i < duration; i++) {
    runningDate.setDate(runningDate.getDate() + 1)
    let urlToUse = new URL(`${darkSkyBaseURL}/forecast/${darkSkyAPIKey}/${lat},${long},${runningDate.getTime()/1000}`)
    Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
    fetchArray.push(fetch(urlToUse).then(result => result.json()))
  }

  Promise.all(fetchArray)
  .then(result => res.status(200).json(result))
  .catch(e => {
    res.status(404).send(JSON.stringify({error: e}))
  })
  
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server online and listening on port ${port}`)
  })
}

module.exports = {
  port,
}