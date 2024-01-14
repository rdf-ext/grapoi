import Edge from '../../Edge.js'
import Path from '../../Path.js'
import { createPathDataset } from './createDataset.js'
import factory from './factory.js'
import * as ns from './namespaces.js'

const links = [
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode()
]

const terms = {}

terms.ends = [ns.ex.end1, ns.ex.end2]
terms.graph = ns.ex.graph

const triples = {}

triples.graph = [
  [ns.ex.start, ns.ex.propertyA, ns.ex.node, ns.ex.otherGraph],
  [ns.ex.node, ns.ex.propertyB, ns.ex.end, terms.graph]
]

triples.in = [
  [ns.ex.end1, ns.ex.propertyA, ns.ex.start],
  [ns.ex.end1, ns.ex.propertyB, ns.ex.start],
  [ns.ex.end2, ns.ex.propertyA, ns.ex.start],
  [ns.ex.end2, ns.ex.propertyB, ns.ex.start]
]

triples.in3 = [
  [ns.ex.end1, ns.ex.propertyA, ns.ex.start],
  [ns.ex.end2, ns.ex.propertyA, ns.ex.start],
  [ns.ex.end1, ns.ex.propertyB, ns.ex.start],
  [ns.ex.end2, ns.ex.propertyB, ns.ex.start],
  [ns.ex.end3, ns.ex.propertyB, ns.ex.start],
  [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start]
]

triples.list = [
  [ns.ex.start, ns.ex.list, links[0]],
  [links[0], ns.rdf.first, ns.ex.end1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.first, ns.ex.end2],
  [links[1], ns.rdf.rest, ns.rdf.nil]
]

triples.list2 = [
  [ns.ex.start, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.item1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.first, ns.ex.item2],
  [links[1], ns.rdf.rest, ns.rdf.nil],
  [ns.ex.start, ns.ex.propertyB, links[2]],
  [links[2], ns.rdf.first, ns.ex.item1],
  [links[2], ns.rdf.rest, links[3]],
  [links[3], ns.rdf.first, ns.ex.item2],
  [links[3], ns.rdf.rest, ns.rdf.nil]
]

triples.listEmpty2 = [
  [ns.ex.start, ns.ex.propertyA, ns.rdf.nil],
  [ns.ex.start, ns.ex.propertyB, ns.rdf.nil]
]

triples.listFirst0 = [
  [ns.ex.start, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.end1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.rest, ns.rdf.nil]
]

triples.listFirst2 = [
  [ns.ex.start, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.end1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.first, ns.ex.end2a],
  [links[1], ns.rdf.first, ns.ex.end2b],
  [links[1], ns.rdf.rest, ns.rdf.nil]
]

triples.listRest0 = [
  [ns.ex.start, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.end1]
]

triples.listRest2 = [
  [ns.ex.start, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.end1],
  [links[0], ns.rdf.rest, links[1]],
  [links[0], ns.rdf.rest, ns.rdf.nil]
]

triples.out = [
  [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
  [ns.ex.start, ns.ex.propertyA, ns.ex.end2],
  [ns.ex.start, ns.ex.propertyB, ns.ex.end1],
  [ns.ex.start, ns.ex.propertyB, ns.ex.end2]
]

triples.out3 = [
  [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
  [ns.ex.start, ns.ex.propertyA, ns.ex.end2],
  [ns.ex.start, ns.ex.propertyB, ns.ex.end1],
  [ns.ex.start, ns.ex.propertyB, ns.ex.end2],
  [ns.ex.start, ns.ex.propertyB, ns.ex.end3],
  [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
]

triples.path = [
  [ns.ex.start, ns.ex.propertyA, ns.ex.node],
  [ns.ex.node, ns.ex.propertyB, ns.ex.end]
]

const single = {}

single.addIn = () => {
  return createPathDataset(triples.in, {
    start: 'object',
    end: 'subject',
    add: false,
    subjects: terms.ends
  })
}

single.addInGraph = () => {
  return createPathDataset(triples.in, {
    start: 'object',
    end: 'subject',
    add: false,
    graph: terms.graph,
    subjects: terms.ends
  })
}

single.addList = () => {
  return createPathDataset(triples.list2, {
    add: false,
    items: [ns.ex.item1, ns.ex.item2]
  })
}

single.addListAny = () => {
  return createPathDataset([], {
    term: null,
    add: false,
    items: []
  })
}

single.addListEmpty = () => {
  return createPathDataset(triples.listEmpty2, {
    add: false,
    items: []
  })
}

single.addListGraph = () => {
  return createPathDataset(triples.list2, {
    add: false,
    graph: terms.graph,
    items: [ns.ex.item1, ns.ex.item2]
  })
}

single.addOut = () => {
  return createPathDataset(triples.out, {
    add: false,
    objects: terms.ends
  })
}

single.addOutGraph = () => {
  return createPathDataset(triples.out, {
    add: false,
    graph: terms.graph,
    objects: terms.ends
  })
}

single.addOutNoFactory = () => {
  const { ptr, ...others } = createPathDataset(triples.out, {
    add: false,
    objects: terms.ends
  })

  delete ptr.factory

  return { ...others, ptr }
}

single.any = () => {
  return createPathDataset([], {
    term: null
  })
}

single.deleteIn = () => {
  return createPathDataset(triples.in3, {
    expect: [4, 5],
    subjects: terms.ends
  })
}

single.default = () => {
  return createPathDataset([])
}

single.defaultGraph = () => {
  return createPathDataset([], {
    graph: terms.graph
  })
}

single.deleteList = () => {
  return createPathDataset([
    ...triples.list2,
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [10]
  })
}

single.deleteListEmpty = () => {
  return createPathDataset([
    ...triples.listEmpty2,
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [2]
  })
}

single.deleteListFirst0 = () => {
  return createPathDataset(triples.listFirst0, {
    expect: []
  })
}

single.deleteListFirst2 = () => {
  return createPathDataset(triples.listFirst2, {
    expect: []
  })
}

single.deleteListRest0 = () => {
  return createPathDataset(triples.listRest0, {
    expect: []
  })
}

single.deleteListRest2 = () => {
  return createPathDataset(triples.listRest2, {
    expect: []
  })
}

single.deleteObjectSubject = () => {
  return createPathDataset([
    ...triples.in,
    [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start]
  ], {
    start: 'object',
    end: 'subject',
    expect: [4],
    subjects: terms.ends
  })
}

single.deleteOut = () => {
  return createPathDataset(triples.out3, {
    start: 'object',
    end: 'subject',
    expect: [4, 5],
    objects: terms.ends
  })
}

single.deleteSubjectObject = () => {
  return createPathDataset([
    ...triples.out,
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [4],
    objects: terms.ends
  })
}

single.deleteSubjectPredicate = () => {
  return createPathDataset([
    ...triples.out,
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [4]
  })
}

single.extend = () => {
  const { edges, ...others } = single.out()

  const ptr = new Path({ edges: [edges[0]] })
  const expectedQuads = new Path({ edges: [edges[0], edges[1]] })

  return { ...others, edges, expectedQuads, ptr }
}

single.extendGraph = () => {
  return createPathDataset(triples.out, {
    graph: terms.graph
  })
}

single.extendGraphNull = () => {
  return createPathDataset(triples.out, {
    graph: null
  })
}

single.graphEdges = () => {
  const { edges, ...others } = createPathDataset(triples.graph)

  const ptr = new Path({ edges })

  return { ...others, edges, ptr }
}

single.graphEdgesNull = () => {
  const { edges, ...others } = createPathDataset(triples.graph)

  const ptr = new Path({ edges, graph: null })

  return { ...others, edges, ptr }
}

single.hasIn = () => {
  return createPathDataset(triples.in3, {
    expect: [0, 1, 2, 3, 4],
    start: 'object',
    end: 'object'
  })
}

single.hasInGraph = () => {
  return createPathDataset([
    ...triples.in3,
    [...triples.in3[0], ns.ex.otherGraph]
  ], {
    expect: [0, 1, 2, 3, 4],
    start: 'object',
    end: 'object',
    graph: terms.graph
  })
}

single.hasInSubjects = () => {
  return createPathDataset(triples.in3, {
    expect: [0, 2, 1, 3],
    start: 'object',
    end: 'object',
    subjects: terms.ends
  })
}

single.hasOut = () => {
  return createPathDataset(triples.out3, {
    expect: [0, 1, 2, 3, 4],
    start: 'subject',
    end: 'subject'
  })
}

single.hasOutGraph = () => {
  return createPathDataset([
    ...triples.out3,
    [...triples.out3[0], ns.ex.otherGraph]
  ], {
    expect: [0, 1, 2, 3, 4],
    start: 'subject',
    end: 'subject',
    graph: terms.graph
  })
}

single.hasOutObjects = () => {
  return createPathDataset(triples.out3, {
    expect: [0, 1, 2, 3],
    start: 'subject',
    end: 'subject',
    objects: terms.ends
  })
}

single.in = () => {
  return createPathDataset(triples.in3, {
    expect: [0, 1, 2, 3, 4],
    start: 'object',
    end: 'subject'
  })
}

single.inGraph = () => {
  return createPathDataset([
    ...triples.in3,
    [...triples.in3[0], ns.ex.otherGraph]
  ], {
    expect: [0, 1, 2, 3, 4],
    start: 'object',
    end: 'subject',
    graph: terms.graph
  })
}

single.inSubjects = () => {
  return createPathDataset(triples.in3, {
    expect: [0, 2, 1, 3],
    start: 'object',
    end: 'subject',
    subjects: terms.ends
  })
}

single.isList = () => {
  const { edges, ...others } = createPathDataset(triples.list)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.isListEmpty = () => {
  const { edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.list, ns.rdf.nil]
  ])

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.length = () => {
  const { dataset, quads, ...others } = createPathDataset(triples.path)

  const ptr = new Path({
    dataset,
    edges: [
      new Edge({ quad: quads[0], start: 'subject', end: 'object' }),
      new Edge({ quad: quads[1], start: 'subject', end: 'object' })
    ]
  })

  return { ...others, dataset, ptr }
}

single.list = () => {
  const { edges, ...others } = createPathDataset(triples.list)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.listEmpty = () => {
  const { edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.list, ns.rdf.nil]
  ])

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.listFirst0 = () => {
  const { edges, ...others } = createPathDataset(triples.listFirst0)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.listFirst2 = () => {
  const { edges, ...others } = createPathDataset(triples.listFirst2)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.listRest0 = () => {
  const { edges, ...others } = createPathDataset(triples.listRest0)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.listRest2 = () => {
  const { edges, ...others } = createPathDataset(triples.listRest2)

  const ptr = new Path({ edges: [edges[0]] })

  return { ...others, edges, ptr }
}

single.nodes = () => {
  const { dataset, quads, ...others } = createPathDataset(triples.path)

  const ptr = new Path({
    edges: [
      new Edge({ dataset, quad: quads[0], start: 'subject', end: 'object' }),
      new Edge({ dataset, quad: quads[1], start: 'subject', end: 'object' })
    ]
  })

  return { ...others, dataset, ptr }
}

single.out = () => {
  return createPathDataset(triples.out3, {
    expect: [0, 1, 2, 3, 4]
  })
}

single.outGraph = () => {
  return createPathDataset([
    ...triples.out3,
    [...triples.out3[0], ns.ex.otherGraph]
  ], {
    expect: [0, 1, 2, 3, 4],
    graph: terms.graph
  })
}

single.outObjects = () => {
  return createPathDataset(triples.out3, {
    expect: [0, 1, 2, 3],
    objects: terms.ends
  })
}

single.traverseOneObject = () => {
  return createPathDataset(triples.out3, {
    expect: [0, 1, 2, 3],
    objects: terms.ends
  })
}

single.traverseOneOrMore = () => {
  const { edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
    [ns.ex.end1, ns.ex.propertyB, ns.ex.end2],
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ])

  const expectedQuads = [
    new Path({ edges: [edges[0]] }),
    new Path({ edges: [edges[0], edges[1]] })
  ]

  return { ...others, edges, expectedQuads }
}

single.traverseOnePtrTerm = () => {
  return createPathDataset([
    ...triples.out3,
    [ns.ex.deadEnd, ns.ex.propertyA, ns.ex.end1]
  ], {
    expect: [0, 1, 2, 3, 4, 5]
  })
}

single.traverseOneSubject = () => {
  return createPathDataset(triples.in3, {
    expect: [0, 1, 2, 3],
    subjects: terms.ends
  })
}

single.traverseZeroOrMore = () => {
  const { dataset, edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
    [ns.ex.end1, ns.ex.propertyB, ns.ex.end2],
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ])

  const expectedQuads = [
    new Path({ dataset, term: edges[0].startTerm }),
    new Path({ edges: [edges[0]] }),
    new Path({ edges: [edges[0], edges[1]] })
  ]

  return { ...others, dataset, edges, expectedQuads }
}

single.traverseZeroOrMoreSelfRef = () => {
  const { dataset, edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.propertyA, ns.ex.end],
    [ns.ex.end, ns.ex.propertyB, ns.ex.end]
  ])

  const expectedQuads = [
    new Path({ dataset, term: edges[0].startTerm }),
    new Path({ edges: [edges[0]] })
  ]

  return { ...others, dataset, edges, expectedQuads }
}

single.traverseZeroOrMoreSelfRef2 = () => {
  const { dataset, edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
    [ns.ex.end1, ns.ex.propertyB, ns.ex.end2],
    [ns.ex.end2, ns.ex.propertyB, ns.ex.start]
  ])

  const expectedQuads = [
    new Path({ dataset, term: edges[0].startTerm }),
    new Path({ edges: [edges[0]] }),
    new Path({ edges: [edges[0], edges[1]] })
  ]

  return { ...others, dataset, edges, expectedQuads }
}

single.traverseZeroOrOne = () => {
  const { dataset, edges, ...others } = createPathDataset([
    [ns.ex.start, ns.ex.propertyA, ns.ex.end1],
    [ns.ex.start, ns.ex.propertyB, ns.ex.end2],
    [ns.ex.start, ns.ex.propertyC, ns.ex.deadEnd]
  ])

  const expectedQuads = [
    new Path({ dataset, term: edges[0].startTerm }),
    new Path({ edges: [edges[0]] }),
    new Path({ edges: [edges[1]] })
  ]

  return { ...others, dataset, edges, expectedQuads }
}

single.trim = () => {
  const { dataset, quads, ...others } = createPathDataset(triples.path)

  const ptr = new Path({
    edges: [
      new Edge({ dataset, quad: quads[0], start: 'subject', end: 'object' }),
      new Edge({ dataset, quad: quads[1], start: 'subject', end: 'object' })
    ]
  })

  const expectedPtr = new Path({ dataset, graph: ptr.edges[1].graph, term: ptr.term })

  return { ...others, dataset, expectedPtr, ptr, quads }
}

single.constructorEdges = single.out
single.constructorEdgesTerm = single.out
single.constructorEdgesGraph = single.outGraph
single.executeAddList = single.addList
single.executeAddOut = single.addOut
single.executeStartEnd = single.in
single.executeObjects = single.out
single.executePredicates = single.out
single.executeQuantifier = single.traverseOneOrMore
single.executeSubject = single.in
single.quadsEdges = single.nodes
single.startTerm = single.out
single.traverseOne = single.out
single.traverseOnePredicate = single.in
single.value = single.out

export default single
