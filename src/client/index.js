import './styles/base.scss'
import './js/app'
import { loadTripData } from './js/loadTripData'
import { populateSelectors } from './js/dateSelectors'
import { destinationSelect, destinationSubmit } from './js/destinationSelect'
import { durationSelector, durationSubmit } from './js/durationSelector'

const now = new Date()
let tripID

window.addEventListener('load', () => {
  tripID = loadTripData(now)
  populateSelectors(now, tripID)
  durationSelector(tripID)
})

document.getElementById('destination-selector').addEventListener('input', (event) => destinationSelect(event))

document.getElementById('destination-submit').addEventListener('click', () => destinationSubmit(tripID))

document.getElementById('duration-selector').addEventListener('change', (event) => durationSubmit(event, tripID))

/*
document.getElementById('remove-trip').addEventListener('click', () => {
  localStorage.removeItem(tripID)
  tripID = null
  console.log(localStorage)
})
*/