export function getPhotos (tripID, destinationQuery, images) {
  
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
      numberOfPhotosToTake = Math.min(response.totalHits, numberOfPhotosToTake)
      for (let i = 0; i < numberOfPhotosToTake; i++) {
        images.push(response.hits[i].largeImageURL)
      }
      
      const heroShot = document.getElementById('hero-shot')
      const img = document.createElement('img')
      img.src = images[0]
      heroShot.appendChild(img)
      const destination = document.getElementById('destination-selector').value.split(', ')
      document.getElementById('hero-overlay').innerHTML = `${destination[0].toUpperCase()}`
      
      const imgDocFragment = document.createDocumentFragment()
      for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img')
        img.src = images[i]
        imgDocFragment.appendChild(img)
      }
      document.getElementById('photogrid').appendChild(imgDocFragment)
      resolve(images)
    })
    .catch(e => {
      alert('An error occurred while fetching images. Please retry by resubmitting trip data.')
      reject(e)
    })
  })
}