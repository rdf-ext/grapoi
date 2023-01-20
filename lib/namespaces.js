import namespace from '@rdfjs/namespace'

const xsd = namespace('http://www.w3.org/2001/XMLSchema#')
const rdfns = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const rdfs = namespace('http://www.w3.org/2000/01/rdf-schema#')

export {
  xsd,
  rdfns as rdf,
  rdfs
}
