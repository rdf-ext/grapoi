import namespace from '@rdfjs/namespace'
import housemd from 'housemd'
import grapoi from '../index.js'
import rdf from '../test/support/factory.js'

const ns = {
  house: namespace('https://housemd.rdf-ext.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('http://schema.org/'),
  xsd: namespace('http://www.w3.org/2001/XMLSchema#')
}

const dataset = rdf.dataset(housemd({ factory: rdf }))

const people = grapoi({ dataset, term: ns.house('person/') })

console.log('people in the house dataset:')

for (const quad of people.out(ns.schema.hasPart).quads()) {
  console.log(`\t${quad.object.value}`)
}

const house = grapoi({ dataset, factory: rdf, term: 'Gregory' }).in().trim()

console.log('properties of the guy named Gregory:')

for (const quad of house.out().quads()) {
  console.log(`\t${quad.predicate.value}: ${quad.object.value}`)
}

const address = house
  .out(ns.schema.homeLocation)
  .out(ns.schema.address)

console.log('address of the guy named Gregory:')

for (const quad of address.trim().out().quads()) {
  console.log(`\t${quad.predicate.value}: ${quad.object.value}`)
}

const nationalities = house
  .out(ns.schema.knows)
  .out(ns.schema.nationality)
  .distinct()

console.log('nationalities of all known people:')

for (const value of nationalities.values) {
  console.log(`\t${value}`)
}
