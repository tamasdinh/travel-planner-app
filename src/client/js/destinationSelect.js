import { getPhotos } from './getPhotos'
import { serverURL, port } from './localhost'
const fetch = require('node-fetch') // need this for testing purposes

export function getDestinations (event) {

  const placeEndPoint = 'places'

  let urlToUse = new URL(`${serverURL}:${port}/${placeEndPoint}`)
  const query = event.target.value.split(', ')
  let nameStartsWith = query[0].match(/[a-zA-Z]*/)[0]
 
  let params = {
    nameStartsWith,
  }
  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
  
  let results = []
  return new Promise((resolve, reject) => {
    fetch(urlToUse)
    .then(res => res.json())
    .then(res => {
      res.geonames.forEach(item => {
        results.push({
          name: item.name,
          countryName: item.countryName,
          countryCode: item.countryCode,
          adminCode1: item.adminCode1,
          lat: item.lat,
          lng: item.lng
        })
      })
      resolve(results)
    })
    .catch(e => {
      alert('An error has occurred during fetching. Please try again later.')
      reject(e) 
    })
  })
}

export function tearDownDataList () {
  const optDropDown = document.getElementById('destination-options')
  while (optDropDown.firstChild) {
    optDropDown.removeChild(optDropDown.firstChild)
  }
}

export function serveDestinationOptions (event, results) {
  
  const relevantResults = results.filter(resultItem => {
    const queryItems = event.target.value.split(' ').map(item => (
      item.match(/[a-zA-Z]*/)[0]
      ))
      let inclusionCounter = 0
      for (let item of queryItems) {
        if ((resultItem.name + resultItem.countryName).includes(item)) {
          inclusionCounter += 1
        }
      }
      return inclusionCounter == queryItems.length
  })

  const optDropDown = document.getElementById('destination-options')
  
  let resultsToReturn = Math.min(relevantResults.length, 10)
  const destOptions = document.createDocumentFragment()
  for (let i = 0; i < resultsToReturn; i++) {
    const item = document.createElement('option')
    item.value = `${relevantResults[i].name}, ${relevantResults[i].countryName}, ${relevantResults[i].adminCode1}`
    const isOnlyOne = event.target.value == item.value || relevantResults.length == 1
    if (!isOnlyOne) {
      destOptions.appendChild(item)
    }
  } 
  optDropDown.appendChild(destOptions)
}

export function destinationSubmit (trip, destResults) {
  const selectionSplit = document.getElementById('destination-selector').value.split(', ')
  const destinationQuery = `${selectionSplit[0]}, ${selectionSplit[1]}`
  let images = []
  
  return new Promise((resolve, reject) => {
  
    if (!trip.destination) {
      trip.destination = destResults.filter(item => (
        item.adminCode1 == selectionSplit[2] &&
        item.name == selectionSplit[0] &&
        item.countryName == selectionSplit[1]
        ))[0]
      }

    if (trip.destination === undefined) {
      reject('There was an error defining trip destination. Please try again.')
    }

    getPhotos(destinationQuery, images)
    .then((images) => {
      trip.images = images
      resolve(trip)
    })
    .catch(e => {
      alert('An error has occurred during execution.')
      reject(e)
    })
  })
}