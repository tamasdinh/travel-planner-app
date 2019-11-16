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
    
    fetch(urlToUse)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      let results = []
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
      for (let i = 0; i <= resultsToReturn; i++) {
        const item = document.createElement('option')
        item.value = `${results[i].name}, ${results[i].adminCode1}, ${results[i].countryName}`
        destOptions.appendChild(item)
      }
      document.getElementById('destination-options').appendChild(destOptions)

    })
    .catch(e => alert('An error has occurred during fetching. Please try again later.', e))
  }
}