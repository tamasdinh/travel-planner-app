export function durationSelector (trip) {
  const selector = document.getElementById('duration-selector')
  const range = 14
  const defaultDuration = 7
  
  const temp = document.createDocumentFragment()
  for (let i = 1; i <= range; i++) {
    const item = document.createElement('option')
    item.value = i
    item.innerHTML = (item.value == 1) ? `${i} day` : `${i} days`
    temp.appendChild(item)
  }
  
  selector.appendChild(temp)

  if (!trip.duration) {
    trip.duration = defaultDuration
  } 
  selector.value = trip.duration
}

export function durationSubmit (event, trip) {
  trip.duration = event.target.value
}