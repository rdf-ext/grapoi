import DataModelFactory from '@rdfjs/data-model/Factory.js'
import DatasetFactory from '@rdfjs/dataset/Factory.js'
import Environment from '@rdfjs/environment'
import TermSetFactory from '@rdfjs/term-set/Factory.js'

const env = new Environment([
  DataModelFactory,
  DatasetFactory,
  TermSetFactory
])

export default env
