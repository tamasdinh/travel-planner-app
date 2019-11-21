import { getDestinations } from '../src/client/js/destinationSelect'

describe('getDestinations successfully retrieves geoNames API data', () => {

  test('getDestinations returns a non-empty array', () => {
    const event = {
      target: {
        value: 'Budapest, Hungary'
      }
    }
    return getDestinations(event).then(result => {
      expect(result.length).toBeGreaterThan(0)
    })
  })

  test('getDestinations returns a correct object from geoNames results', () => {
    const event = {
      target: {
        value: 'Budapest, Hungary'
      }
    }
    return getDestinations(event).then(result => {
      expect(typeof result[0].name).toBe('string')
      expect(typeof result[0].countryName).toBe('string')
      expect(typeof result[0].countryCode).toBe('string')
      expect(typeof result[0].adminCode1).toBe('string')
      expect(typeof result[0].lat).toBe('string')
      expect(typeof result[0].lat).toBe('string')
    })
  })

})