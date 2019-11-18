import { serverURL, port } from './localhost'

export function getWeather (tripID) {
  
  // console.log('tripID from getWeather:', tripID)

  const endPoint = 'weather'
  
  let urlToUse = new URL(`${serverURL}:${port}/${endPoint}`)
 
  let trip = JSON.parse(localStorage.getItem(tripID))
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
  console.log('Results from weatherData:', weatherData)
}