import { port } from '../src/server/server'
const fetch = require('node-fetch')

describe('Express server successfully obtains place data', () => {

  test('Express server obtains non-empty array', () => {
    return fetch(`http://localhost:${port}/places?nameStartsWith=Budapest`)
    .then(response => response.json())
    .then(result => {
      expect(result.totalResultsCount).toBeGreaterThan(0)
    })
  })

})