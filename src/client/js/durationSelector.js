export function durationSelector (tripID) {
  const selector = document.getElementById('duration-selector')
  const range = 14
  const defaultValue = 7
  
  const temp = document.createDocumentFragment()
  for (let i = 1; i <= range; i++) {
    const item = document.createElement('option')
    item.value = i
    item.innerHTML = (item.value == 1) ? `${i} day` : `${i} days`
    temp.appendChild(item)
  }
  
  selector.appendChild(temp)
  selector.value = defaultValue
  
  const trip = JSON.parse(localStorage.getItem(tripID))
  trip.duration = selector.value
  localStorage.setItem(tripID, JSON.stringify(trip)) 
}

export function durationSubmit (event, tripID) {
  const trip = JSON.parse(localStorage.getItem(tripID))
  trip.duration = event.target.value
  localStorage.setItem(tripID, JSON.stringify(trip)) 
}