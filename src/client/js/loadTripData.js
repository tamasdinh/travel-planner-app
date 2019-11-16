import { generateTripID } from './dateSelectors'

export function loadTripData (now) {
  let tripID
  
  for (let item of Object.keys(localStorage)) {
    if (item.search(/trip/) >= 0) {
      console.log('Saved trip exists in local storage. Loading data...')
      console.log(localStorage)
      tripID = item
      break
    }
  }
  if (!tripID) {
    console.log('No trips saved; creating trip datastore.')
    tripID = generateTripID()
    localStorage.setItem(tripID, JSON.stringify({year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()}))
  }
  console.log('Trip ID:', tripID)
  return tripID
}