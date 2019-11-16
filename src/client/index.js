import './styles/base.scss'
import './js/app'
import { loadTripData } from './js/loadTripData'
import { populateSelectors } from './js/dateSelectors'
import { destinationSelect } from './js/destinationSelect'

const now = new Date()
let tripID

window.addEventListener('load', () => {
  tripID = loadTripData(now)
  populateSelectors(now, tripID)
})

document.getElementById('destination-selector').addEventListener('input', (event) => destinationSelect(event))

document.getElementById('destination-submit').addEventListener('click', () => {
  const trip = JSON.parse(localStorage.getItem(tripID))
  trip.destination = undefined
  const selection = document.getElementById('destination-selector').value
  trip.destination = Object.values(JSON.parse(localStorage.getItem('results'))).filter(item => 
    item.name == selection.split(', ')[0] &&
    item.adminCode1 == selection.split(', ')[1] &&
    item.countryName == selection.split(', ')[2]
  )[0]
  if (!trip.destination) {
    alert('Please select location from drop-down list and click [Submit]!')
  }
  localStorage.setItem(tripID, JSON.stringify(trip))
  console.log(trip.destination)

  const destinationData = JSON.parse(localStorage.getItem('results'))
  console.log(destinationData)

})


document.getElementById('remove-trip').addEventListener('click', () => {
  localStorage.removeItem(tripID)
  tripID = null
  console.log(localStorage)
})
