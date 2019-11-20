import { loadCountDown } from './dateSelectors'

export function loadTripData() {
  let trip
  
  for (let itemKey of Object.keys(localStorage)) {
    if (itemKey.search(/trip/) >= 0) {
      console.log('Saved trip exists in local storage. Loading data...')
      trip = JSON.parse(localStorage.getItem(itemKey))
      console.log('Trip data:', trip)
      loadCountDown(trip)
      break
    }
  }
  return trip
}

export function saveTripData(trip) {
    localStorage.setItem(trip.id, JSON.stringify(trip))
    console.log('Trip data saved:', trip)
}

export function generateTripID () {
  return 'trip_' + new Date().getTime().toString()
}

export const generateTripObject = (now) => ({
    id: generateTripID(),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
})