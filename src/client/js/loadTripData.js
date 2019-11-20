import { generateTripID } from './dateSelectors'

export function loadTripData (now) {
  let tripID
  
  for (let item of Object.keys(localStorage)) {
    if (item.search(/trip/) >= 0) {
      console.log('Saved trip exists in local storage. Loading data...')
      tripID = item
      console.log('Trip data:', JSON.parse(localStorage.getItem(tripID)))
      break
    }
  }
  loadCountDown(JSON.parse(localStorage.getItem(tripID)))
  if (!tripID) {
    console.log('No trips saved; creating trip datastore.')
    tripID = generateTripID()
    localStorage.setItem(tripID, JSON.stringify({year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()}))
    console.log('Trip data:', JSON.parse(localStorage.getItem(tripID)))
  }
  return tripID
}

export function loadCountDown(trip) {
  document.getElementById('sleeps').innerHTML =
        ((new Date(trip.year, trip.month - 1, trip.day) - new Date()) / 1000 / 60 / 60 / 24 + 1).toFixed(0)
}