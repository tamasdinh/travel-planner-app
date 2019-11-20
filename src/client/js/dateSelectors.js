import { months } from './localhost'

export function populateSelectors (now, trip) {
  const scaffold = document.createDocumentFragment()
  
  for (let sel of ['select-year', 'select-month', 'select-day']) {
    const selector = document.createElement('select')
    let starter, range, currentPeriod
    selector.id = sel + '_' + now.getTime()
    
    switch (sel) {
      case 'select-year': {
        starter = now.getFullYear()
        range = now.getFullYear() + 2
        currentPeriod = now.getFullYear()
        break
      }
      case 'select-month': {
        starter = 1
        range = 12
        currentPeriod = now.getMonth() + 1
        break
      }
      default: {
        starter = 1
        range = 30
        currentPeriod = now.getDate()
      }
    }

    selector.appendChild(createOptions(sel, starter, range, currentPeriod, trip, now))

    switch (sel) {
      case 'select-year': {
        selector.value = trip.year
        break
      }
      case 'select-month': {
        selector.value = trip.month
        break
      }
      default: {
        selector.value = trip.day
      }
    }
    
    selector.addEventListener('change', (event) => {
      dateChangeHandler(event, sel, selector, currentPeriod, now, trip)
    })

    scaffold.appendChild(selector)
  }

  document.getElementsByClassName('destination-date')[0].appendChild(scaffold)
}

function createOptions (sel, starter, range, currentPeriod, trip, now) {
  const scaffold = document.createDocumentFragment()
  for (let y = starter; y <= range; y++) {
    const item = document.createElement('option')
    if (sel == 'select-month') {
      item.innerHTML = months[y-1]
    } else {
      item.innerHTML = y
    }
    item.value = y

    if (sel == 'select-month') {
      if (trip.year == now.getFullYear() &&
          item.value < currentPeriod) {
            item.disabled = true
      }
    }

    if (sel == 'select-day') {
      if (trip.year == now.getFullYear() &&
          trip.month == now.getMonth() + 1 &&
          item.value < currentPeriod) {
            item.disabled = true
      }
    }

    scaffold.appendChild(item)
  }
  return scaffold
}

function dateChangeHandler(event, sel, selector, currentPeriod, now, trip) {
  switch (sel) {
    case 'select-year': {
      trip.year = event.target.value
      for (let sibling of [selector.nextSibling, selector.nextSibling.nextSibling]) {
        if (sibling.id.includes('month')) {
          currentPeriod = now.getMonth() + 1
        } else if (sibling.id.includes('day')) {
          currentPeriod = now.getDate()
        }
        for (let item of sibling) {
          if (event.target.value == now.getFullYear() &&
          item.value < currentPeriod) {
            item.disabled = true
            sibling.value = currentPeriod
            if (sibling === selector.nextSibling) {
              trip.month = currentPeriod
            } else {
              trip.day = currentPeriod
            }
          } else {
            item.disabled = false
          }
        }
      } 
      break
    }
    case 'select-month': {
      trip.month = event.target.value
      let sibling = selector.nextSibling
      currentPeriod = now.getDate()
      for (let item of sibling) {
        if (trip.year == now.getFullYear() &&
            event.target.value == now.getMonth() + 1 &&
            item.value < currentPeriod) {
              item.disabled = true
              sibling.value = currentPeriod
              trip.day = currentPeriod
        } else {
          item.disabled = false
        }
      } 
      break
    }
    default: {
      trip.day = event.target.value
    }
  }
  localStorage.setItem(trip.id, JSON.stringify(trip))
  loadCountDown(trip)
  console.log('New trip data:', trip)
}

export function loadCountDown(trip) {
  document.getElementById('sleeps').innerHTML =
        ((new Date(trip.year, trip.month - 1, trip.day) - new Date()) / 1000 / 60 / 60 / 24 + 1).toFixed(0)
        document.getElementById('sleeps-text').innerHTML = ' days until your trip!'
}