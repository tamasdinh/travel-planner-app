export function destinationSelect (event) {

  const serverURL = 'http://localhost'
  const port = 8081
  const placeEndPoint = 'places'

  let urlToUse = new URL(`${serverURL}:${port}/${placeEndPoint}`)
  const optDropDown = document.getElementById('destination-options')
  if (!event.target.value.includes(',') && event.target.value.length >= 4) {
    while (optDropDown.firstChild) {
      optDropDown.removeChild(optDropDown.firstChild)
    }
    let params = {query: event.target.value}
    Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))
    
    let results = []

    fetch(urlToUse)
    .then(res => res.json())
    .then(res => {
      console.log(res)
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
      localStorage.setItem('results', JSON.stringify(results))
      
      let resultsToReturn = Math.min(results.length, 20)
      const destOptions = document.createDocumentFragment()
      for (let i = 0; i < resultsToReturn; i++) {
        const item = document.createElement('option')
        item.value = `${results[i].name}, ${results[i].adminCode1}, ${results[i].countryName}`
        destOptions.appendChild(item)
      }
      document.getElementById('destination-options').appendChild(destOptions)

    })
    .catch(e => {
      alert('An error has occurred during fetching. Please try again later.')
      console.log(e) 
    })
  }
}

export function destinationSubmit (tripID) {
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
}