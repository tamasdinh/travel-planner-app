import { serverURL, port, months, days } from './localhost'

export function getWeather (trip) {

  const endPoint = 'weather'
  
  let urlToUse = new URL(`${serverURL}:${port}/${endPoint}`)
 
  let lat = trip.destination.lat
  let long = trip.destination.lng
  let startDate = new Date(`${trip.year}, ${trip.month}, ${trip.day}`).getTime()
  let duration = trip.duration
  
  let params = {
    lat,
    long,
    startDate,
    duration
  }
  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
  
  return new Promise((resolve, reject) => {
    fetch(urlToUse)
    .then(res => res.json())
    .then(res => {
      let forecast = []
      res.forEach(item => {
        forecast.push({
          time: item.daily.data[0].time,
          summary: item.daily.data[0].summary,
          icon: item.daily.data[0].icon,
          tempLow: item.daily.data[0].temperatureLow,
          tempHigh: item.daily.data[0].temperatureHigh,
        })
      })
      resolve(forecast)
    })
    .catch(e => {
      alert('An error has occurred while fetching weather data. Please try again.')
      reject(e)
    })
  })
}

export function serveWeatherData(weatherData) {
  
  const weatherResultsItem = document.getElementsByClassName('weather-results')[0]
  while (weatherResultsItem.firstChild) {
    weatherResultsItem.removeChild(weatherResultsItem.firstChild)
  }
  
  const greeting = document.getElementById('weather-greeting')
  if (greeting) {
    document.body.removeChild(greeting)
  }

  const weatherTitle = document.createElement('h1')
  weatherTitle.innerHTML = 'Expected weather for your trip'
  weatherTitle.id = 'weather-greeting'
  document.getElementsByTagName('body')[0].insertBefore(
    weatherTitle, document.getElementsByClassName('weather-results')[0]
  )
  const mainFragment = document.createDocumentFragment()
  for (let item of weatherData) {
    const subDiv = document.createElement('div')
    subDiv.className = 'weather-subcontainer'
    const tempDiv = document.createElement('div')
    tempDiv.className = 'temperature'
    
    const dateItem = document.createElement('p')
    dateItem.innerHTML = getDateString(item.time)
    dateItem.className = 'date'

    const tempLow = document.createElement('p')
    tempLow.innerHTML = item.tempLow.toFixed(1) + '˚C'
    tempLow.className = 'temp-low'
    
    const tempHigh = document.createElement('p')
    tempHigh.innerHTML = item.tempHigh.toFixed(1) + '˚C'
    tempHigh.className = 'temp-high'

    const summary = document.createElement('p')
    summary.innerHTML = item.summary
    summary.className = 'summary'

    for (let tempItem of [tempLow, tempHigh]) {
      tempDiv.appendChild(tempItem)
    }

    for (let htmlItem of [dateItem, tempDiv, summary]) {
      subDiv.appendChild(htmlItem)
    }

    mainFragment.appendChild(subDiv)
  }
  document.getElementsByClassName('weather-results')[0].appendChild(mainFragment)
}

function getDateString (epoch) {
  const date = new Date(epoch * 1000)
  let dateString = {
    year: date.getFullYear(),
    month: months[date.getMonth()],
    date: date.getDate(),
    day: days[date.getDay()]
  }
  return dateString = dateString.date + ' ' +
                      dateString.month + ' ' +
                      dateString.year + '<br />' + ' ' +
                      dateString.day
}