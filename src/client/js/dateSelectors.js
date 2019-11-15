export function generateTripID () {
  return 'trip_' + new Date().getTime().toString()
 }

export function populateSelectors (now, tripID) {
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

    selector.appendChild(createOptions(sel, starter, range, currentPeriod, tripID, now))

    switch (sel) {
      case 'select-year': {
        selector.value = JSON.parse(localStorage[tripID]).year
        break
      }
      case 'select-month': {
        selector.value = JSON.parse(localStorage[tripID]).month
        break
      }
      default: {
        selector.value = JSON.parse(localStorage[tripID]).day
      }
    }
    
    selector.addEventListener('change', (event) => {
      let trip
      trip = JSON.parse(localStorage[tripID])
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
            if (JSON.parse(localStorage[tripID]).year == now.getFullYear() &&
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
      localStorage.setItem(tripID, JSON.stringify(trip))
      console.log('New trip data:', localStorage[tripID])
    })

    scaffold.appendChild(selector)
  }

  document.getElementsByClassName('destination-date')[0].appendChild(scaffold)
}

function createOptions (sel, starter, range, currentPeriod, tripID, now) {
  const scaffold = document.createDocumentFragment()
  for (let y = starter; y <= range; y++) {
    const item = document.createElement('option')
    item.innerHTML = y
    item.value = y

    if (sel == 'select-month') {
      if (JSON.parse(localStorage[tripID]).year == now.getFullYear() &&
          item.value < currentPeriod) {
            item.disabled = true
      }
    }

    if (sel == 'select-day') {
      if (JSON.parse(localStorage[tripID]).year == now.getFullYear() &&
          JSON.parse(localStorage[tripID]).month == now.getMonth() &&
          item.value < currentPeriod) {
            item.disabled = true
      }
    }

    scaffold.appendChild(item)
  }
  return scaffold
}