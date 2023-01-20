import namespace from '@rdfjs/namespace'
import grapoi from '../index.js'
import rdf from '../test/support/factory.js'

const ns = {
  ex: namespace('https://example.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('http://schema.org/'),
  xsd: namespace('http://www.w3.org/2001/XMLSchema#')
}

const dataset = rdf.dataset()

const person = grapoi({ dataset, factory: rdf, term: ns.ex.address })

person.addOut(ns.schema.homeLocation, location => {
  location.addOut(ns.schema.address, address => {
    address.addOut(ns.schema.addressLocality, 'Plainsboro Township')
    address.addOut(ns.schema.addressRegion, 'NJ')
    address.addOut(ns.schema.postalCode, '08536')
    address.addOut(ns.schema.streetAddress, '221B Baker Street')
  })
})

for (const quad of dataset) {
  console.log(`${quad.subject.value} - ${quad.predicate.value} - ${quad.object.value}`)
}
