export function getPhotos (destinationQuery, images) {
  
  let numberOfPhotosToTake = 1 + 5 * 5 // 1 hero shot + 5x5 grid

  const serverURL = 'http://localhost'
  const port = 8081
  const photosEndPoint = 'photos'

  let urlToUse = new URL(`${serverURL}:${port}/${photosEndPoint}`)
  const params = {q: `${destinationQuery}`}

  Object.keys(params).forEach(key => urlToUse.searchParams.append(key, params[key]))

  return new Promise ((resolve, reject) => {
    fetch(urlToUse)
    .then(res => res.json())
    .then(response => {
      
      let entity = response.entity
      numberOfPhotosToTake = Math.min(response.response.totalHits, numberOfPhotosToTake)
      for (let i = 0; i < numberOfPhotosToTake; i++) {
        images.push(response.response.hits[i].largeImageURL)
      }
      
      const photoGrid = document.getElementById('photogrid')
      while (photoGrid.firstChild) {
        photoGrid.removeChild(photoGrid.firstChild)
      }

      const baseT = document.getElementById('base-text')
      if (baseT != null) {
        baseT.innerHTML = ''
      }

      const heroShot = document.getElementById('hero-shot')
      while (heroShot.firstChild) {
        heroShot.removeChild(heroShot.firstChild)
      }
      const img = document.createElement('img')
      img.src = images[0]
      heroShot.appendChild(img)
      
      const imgDocFragment = document.createDocumentFragment()
      for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img')
        img.src = images[i]
        imgDocFragment.appendChild(img)
      }
      document.getElementById('photogrid').appendChild(imgDocFragment)
      return [images, entity]
    })
    .then(array => {
      if (images.length == 0) {
        reject(alert('No images found in the database. Please try again.'))
      
      } else {

        const heroOverLay = document.createElement('div')
        heroOverLay.id = 'hero-overlay'
        document.getElementById('hero-shot').appendChild(heroOverLay)
        
        const baseText = document.createElement('p')
        baseText.innerHTML = 'DESTINATION:'
        baseText.id = 'base-text'
        document.getElementById('hero-overlay').insertBefore(baseText, document.getElementById('hero-overlay').firstChild)
        
        const heroOverLayText = document.createElement('p')
        heroOverLayText.id = 'hero-overlay-text'
        document.getElementById('hero-overlay').appendChild(heroOverLayText)
        
        const destination = document.getElementById('destination-selector').value.split(', ')
        document.getElementById('hero-overlay-text').innerHTML = `${array[1].toUpperCase()}`
        
        resolve(images)
      }
    })
    .catch(e => {
      alert('An error occurred while fetching images. Please retry by resubmitting trip data.')
      reject(e)
    })
  })
}