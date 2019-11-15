import './styles/base.scss'
import './js/app'
import { populateSelectors, generateTripID } from './js/dateSelectors.js'
const now = new Date()

let tripID

window.addEventListener('load', () => {
  for (let item of Object.keys(localStorage)) {
    if (item.search(/trip/) >= 0) {
      console.log('Saved trip exists in local storage. Loading data...')
      console.log(localStorage)
      tripID = item
      break
    }
  }
  if (tripID) {
    console.log('No trips saved; creating trip datastore.')
    tripID = generateTripID()
    localStorage.setItem(tripID, JSON.stringify({year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()}))
  }
  console.log('Trip ID:', tripID)
  populateSelectors(now, tripID)
})

document.getElementById('remove-trip').addEventListener('click', () => {
  localStorage.removeItem(tripID)
  tripID = null
  console.log(localStorage)
})
