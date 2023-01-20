# grapoi

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/grapoi/test.yaml?branch=master)](https://github.com/rdf-ext/grapoi/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/grapoi.svg)](https://www.npmjs.com/package/grapoi)

Grapoi is a JavaScript graph traversal library inspired by [Gremlin](https://tinkerpop.apache.org/gremlin.html).
It allows querying [RDF/JS Datasets](https://rdf.js.org/dataset-spec/) readable and intuitive way.
Grapoi makes processing RDF data in JavaScript fun again.

The main purpose of Grapoi is to traverse and filter through datasets with ease.
Most methods will return new object instances that refer back to the result terms after being processed by their respective functions.

Additionally, Grapoi keeps track of all quads traversed from the start term, making it possible for you to keep track of how each result was found during the query process if needed - thus providing extra flexibility when dealing with complex datasets where multiple paths might lead towards desired results.

## Install

```bash
npm install grapoi --save
```

## Usage

### Query Data

This example shows how to query an RDF/JS Dataset based on the [housemd](https://www.npmjs.com/package/housemd) dataset.
It covers how to use the methods `.out()` and `.in()` to traverse outwards or inwards. 
`.trim()` can be used to remove the tail of the traversing history, which is not of interest.
Once this is done, only those quads that are relevant can be listed with the `.quads()` method. 
A unique list of terms can be created with `.distinct()`.

```javascript
import grapoi from 'grapoi'
import housemd from 'housemd'
import rdf from 'rdf-ext'

const ns = {
  house: rdf.namespace('https://housemd.rdf-ext.org/'),
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: rdf.namespace('http://schema.org/'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#')
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
```

### Create Data

This example shows how to create data with Grapoi.
The starting point is the term given in the `grapoi` factory function.
Quads are added `.addOut()` from subject to object direction.
Nested structures can be created in the callback, which is called with a `grapoi` instance referring to the new object.

```javascript
import grapoi from 'grapoi'
import rdf from 'rdf-ext'

const ns = {
  ex: rdf.namespace('https://example.org/'),
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: rdf.namespace('http://schema.org/'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#')
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
```