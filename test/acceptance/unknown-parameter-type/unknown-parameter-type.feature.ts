import { Given } from '@cucumber/fake-cucumber'

Given('{airport} is closed because of a strike', function (airport) {
  throw new Error(
    'Should not be called because airport parameter type has not been defined'
  )
})
