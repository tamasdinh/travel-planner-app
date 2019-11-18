
// TODO!!! check how we can get all results from geoames API (not just 100)


import './styles/base.scss'
import './js/app'
import { loadTripData } from './js/loadTripData'
import { populateSelectors } from './js/dateSelectors'
import { getDestinations, tearDownDataList, serveDestinationOptions, destinationSubmit } from './js/destinationSelect'
import { durationSelector, durationSubmit } from './js/durationSelector'
import { getWeather, serveWeatherData } from './js/getWeather'

const now = new Date()
let tripID
let prevLength = 0
let destResults = []

window.addEventListener('load', () => {
  tripID = loadTripData(now)
  populateSelectors(now, tripID)
  durationSelector(tripID)

  const trip = JSON.parse(localStorage.getItem(tripID))
  if (trip.destination) {
    document.getElementById('destination-selector').value =
    `${trip.destination.name}, ${trip.destination.countryName}, ${trip.destination.adminCode1}`
  }
})

document.getElementById('destination-selector').addEventListener('input', (event) => {
  if (event.target.value.length == 4 && prevLength < event.target.value.length) {
    getDestinations(event)
    .then(results => {
      destResults = results
      return destResults
    })
    .then(destResults => {
      tearDownDataList()
      serveDestinationOptions(event, destResults)
    })
  } else if (destResults.length > 0) {
    tearDownDataList()
    serveDestinationOptions(event, destResults)
  }
  prevLength = event.target.value.length
  if (event.target.value.length < 4) {
    destResults = []
    tearDownDataList()
  }
})

document.getElementById('destination-submit').addEventListener('click', () => {
  destinationSubmit(tripID, destResults)
  .then(console.log('Trip data saved.'))
  .then(getWeather(tripID)
  .then((weatherData) => serveWeatherData(weatherData)))
  .catch(e => {
    alert('An error has occurred while trying to fetch weather data. Please try again.')
    console.log(e)
  })
})

document.getElementById('duration-selector').addEventListener('change', (event) => durationSubmit(event, tripID))

document.getElementById('remove-destination-text').addEventListener('click', () => {
  document.getElementById('destination-selector').value = ''
  
  for (let htmlContainer of
    [document.getElementById('destination-options'),
    document.getElementById('hero-shot'),
    document.getElementById('photogrid')]) {

      while (htmlContainer.firstChild) {
        htmlContainer.removeChild(htmlContainer.firstChild)
      }
  }

  const trip = JSON.parse(localStorage.getItem(tripID))
  delete trip.destination
  delete trip.images
  localStorage.setItem(tripID, JSON.stringify(trip))
})


/*
document.getElementById('remove-trip').addEventListener('click', () => {
  localStorage.removeItem(tripID)
  tripID = null
  console.log(localStorage)
})
*/