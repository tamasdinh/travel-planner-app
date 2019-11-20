import { loadTripData, generateTripObject, saveTripData } from './handleTripData'
import { populateSelectors } from './dateSelectors'
import { getDestinations, tearDownDataList, serveDestinationOptions, destinationSubmit } from './destinationSelect'
import { durationSelector, durationSubmit } from './durationSelector'
import { getWeather, serveWeatherData } from './getWeather'

export function weatherApp () {

  const now = new Date()
  let trip
  let prevLength = 0
  let destResults = []

  window.addEventListener('load', () => {
    trip = loadTripData(now)
    if (trip === undefined) {
      trip = generateTripObject(now)
    }
    populateSelectors(now, trip)
    durationSelector(trip)

    if (trip.destination) {
      document.getElementById('destination-selector').value =
      `${trip.destination.name}, ${trip.destination.countryName}, ${trip.destination.adminCode1}`
    }
  })

  document.getElementById('destination-selector').addEventListener('input', (event) => {
    if (event.target.value.length >= 4 && prevLength < event.target.value.length) {
      getDestinations(event)
      .then(results => {
        destResults = results
        return results
      })
      .then(results => {
        tearDownDataList()
        serveDestinationOptions(event, results)
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
    destinationSubmit(trip, destResults)
    .then(trip => getWeather(trip))
    .then(weatherData => serveWeatherData(weatherData))
    .catch(e => {
      alert('An error has occurred while trying to fetch weather data. Please try again.')
      console.log(e)
    })
    .finally(() => {
      localStorage.setItem(trip.id, JSON.stringify(trip))
    })
  })

  document.getElementById('duration-selector').addEventListener('change', (event) => durationSubmit(event, trip))

  document.getElementById('remove-destination-text').addEventListener('click', () => {
    document.getElementById('destination-selector').value = ''
    
    for (let htmlContainer of
      [document.getElementById('destination-options'),
      document.getElementById('hero-shot'),
      document.getElementById('photogrid'),
      document.getElementsByClassName('weather-results')[0]]) {

        while (htmlContainer.firstChild) {
          htmlContainer.removeChild(htmlContainer.firstChild)
        }
    }
    const h1 = document.getElementsByTagName('h1')[0]
    if (h1) {
      h1.innerHTML = ''
    }
    delete trip.destination
    delete trip.images
  })

  document.getElementById('remove-trip').addEventListener('click', () => {
    localStorage.removeItem(trip.id)
    trip = generateTripObject(now)
    saveTripData(trip)
    window.location.reload()
  })

}