import { getPhotos } from './getPhotos'

export function getDestinations (event) {

  const serverURL = 'http://localhost'
  const port = 8081
  const placeEndPoint = 'places'

  let urlToUse = new URL(`${serverURL}:${port}/${placeEndPoint}`)
  const query = event.target.value.split(', ')
  let nameStartsWith = query[0].match(/[a-zA-Z]*/)[0]
 
  let params = {
    nameStartsWith,
  }
  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
  
  let results = []
  return new Promise((resolve, reject) => {
    fetch(urlToUse)
    .then(res => res.json())
    .then(res => {
      res.geonames.forEach(item => {
        results.push({
          name: item.name,
          countryName: item.countryName,
          countryCode: item.countryCode,
          adminCode1: item.adminCode1,
          lat: item.lat,
          lng: item.lng
        })
      })
      return results
    })
    .then(results => resolve(results))
    .catch(e => {
      alert('An error has occurred during fetching. Please try again later.')
      reject(e) 
    })
  })
}

export function tearDownDataList () {
  const optDropDown = document.getElementById('destination-options')
  console.log('Destroying datalist')
  while (optDropDown.firstChild) {
    optDropDown.removeChild(optDropDown.firstChild)
  }
}

export function serveDestinationOptions (event, results) {
  console.log('datalist received this many results:', results.length)
  
  const relevantResults = results.filter(resultItem => {
    const queryItems = event.target.value.split(' ').map(item => (
      item.match(/[a-zA-Z]*/)[0]
      ))
      let inclusionCounter = 0
      for (let item of queryItems) {
        if ((resultItem.name + resultItem.countryName).includes(item)) {
          inclusionCounter += 1
        }
      }
      return inclusionCounter == queryItems.length
  })
  console.log(relevantResults)

  const optDropDown = document.getElementById('destination-options')
  
  console.log('Building datalist; input length:', event.target.value.length)
  let resultsToReturn = Math.min(relevantResults.length, 10)
  const destOptions = document.createDocumentFragment()
  for (let i = 0; i < resultsToReturn; i++) {
    const item = document.createElement('option')
    item.value = `${relevantResults[i].name}, ${relevantResults[i].countryName}, ${relevantResults[i].adminCode1}`
    const isOnlyOne = event.target.value == item.value || relevantResults.length == 1
    if (!isOnlyOne) {
      destOptions.appendChild(item)
    }
  } 
  optDropDown.appendChild(destOptions)
}

export function destinationSubmit (tripID, destinationResults) {
  const selectionSplit = document.getElementById('destination-selector').value.split(', ')
  const destinationQuery = `${selectionSplit[0]}, ${selectionSplit[1]}`
  let images = []
  return new Promise((resolve, reject) => {
    getPhotos(tripID, destinationQuery, images)
    .then((images) => {
      const trip = JSON.parse(localStorage.getItem(tripID))
      trip.destination = destinationResults.filter(item => (
          item.adminCode1 == selectionSplit[2] &&
          item.name == selectionSplit[0] &&
          item.countryName == selectionSplit[1]
      ))[0]
      trip.images = images
      console.log('Trip data saved:', trip)
      localStorage.setItem(tripID, JSON.stringify(trip))
      localStorage.removeItem('results')
      resolve()
    })
    .catch(e => {
      alert('An error has occurred during execution.')
      reject(e)
    })
  })
}