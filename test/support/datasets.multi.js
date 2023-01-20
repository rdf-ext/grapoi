import Edge from '../../Edge.js'
import Path from '../../Path.js'
import PathList from '../../PathList.js'
import { createPathListDataset } from './createDataset.js'
import factory from './factory.js'
import * as ns from './namespaces.js'

const links = [
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode(),
  factory.blankNode()
]

const terms = {}

terms.ends = [ns.ex.end1, ns.ex.end2]
terms.items = [ns.ex.item1, ns.ex.item2]
terms.starts = [ns.ex.start1, ns.ex.start2]
terms.graphs = [ns.ex.graph1, ns.ex.graph2]

const triples = {}

triples.in = [
  [ns.ex.end1, ns.ex.propertyA, ns.ex.start1],
  [ns.ex.end1, ns.ex.propertyA, ns.ex.start2],
  [ns.ex.end1, ns.ex.propertyB, ns.ex.start1],
  [ns.ex.end1, ns.ex.propertyB, ns.ex.start2],
  [ns.ex.end2, ns.ex.propertyA, ns.ex.start1],
  [ns.ex.end2, ns.ex.propertyA, ns.ex.start2],
  [ns.ex.end2, ns.ex.propertyB, ns.ex.start1],
  [ns.ex.end2, ns.ex.propertyB, ns.ex.start2],
  [ns.ex.end3, ns.ex.propertyA, ns.ex.start2]
]

triples.inPath = [
  [links[0], ns.ex.propertyA, ns.ex.start1],
  [links[1], ns.ex.propertyA, ns.ex.start2],
  [links[2], ns.ex.propertyB, links[0]],
  [links[3], ns.ex.propertyB, links[1]],
  [ns.ex.end1, ns.ex.propertyA, links[2]],
  [ns.ex.end1, ns.ex.propertyB, links[2]],
  [ns.ex.end2, ns.ex.propertyA, links[2]],
  [ns.ex.end2, ns.ex.propertyB, links[2]],
  [ns.ex.end1, ns.ex.propertyA, links[3]],
  [ns.ex.end1, ns.ex.propertyB, links[3]],
  [ns.ex.end2, ns.ex.propertyA, links[3]],
  [ns.ex.end2, ns.ex.propertyB, links[3]]
]

triples.list2 = [
  [ns.ex.start1, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.item1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.first, ns.ex.item2],
  [links[1], ns.rdf.rest, ns.rdf.nil],
  [ns.ex.start2, ns.ex.propertyB, links[2]],
  [links[2], ns.rdf.first, ns.ex.item1],
  [links[2], ns.rdf.rest, links[3]],
  [links[3], ns.rdf.first, ns.ex.item2],
  [links[3], ns.rdf.rest, ns.rdf.nil]
]

triples.list4 = [
  [ns.ex.start1, ns.ex.propertyA, links[0]],
  [links[0], ns.rdf.first, ns.ex.item1],
  [links[0], ns.rdf.rest, links[1]],
  [links[1], ns.rdf.first, ns.ex.item2],
  [links[1], ns.rdf.rest, ns.rdf.nil],
  [ns.ex.start1, ns.ex.propertyB, links[2]],
  [links[2], ns.rdf.first, ns.ex.item1],
  [links[2], ns.rdf.rest, links[3]],
  [links[3], ns.rdf.first, ns.ex.item2],
  [links[3], ns.rdf.rest, ns.rdf.nil],
  [ns.ex.start2, ns.ex.propertyA, links[4]],
  [links[4], ns.rdf.first, ns.ex.item1],
  [links[4], ns.rdf.rest, links[5]],
  [links[5], ns.rdf.first, ns.ex.item2],
  [links[5], ns.rdf.rest, ns.rdf.nil],
  [ns.ex.start2, ns.ex.propertyB, links[6]],
  [links[6], ns.rdf.first, ns.ex.item1],
  [links[6], ns.rdf.rest, links[7]],
  [links[7], ns.rdf.first, ns.ex.item2],
  [links[7], ns.rdf.rest, ns.rdf.nil]
]

triples.out = [
  [ns.ex.start1, ns.ex.propertyA, ns.ex.end1],
  [ns.ex.start1, ns.ex.propertyA, ns.ex.end2],
  [ns.ex.start1, ns.ex.propertyB, ns.ex.end1],
  [ns.ex.start1, ns.ex.propertyB, ns.ex.end2],
  [ns.ex.start2, ns.ex.propertyA, ns.ex.end1],
  [ns.ex.start2, ns.ex.propertyA, ns.ex.end2],
  [ns.ex.start2, ns.ex.propertyB, ns.ex.end1],
  [ns.ex.start2, ns.ex.propertyB, ns.ex.end2],
  [ns.ex.start2, ns.ex.propertyA, ns.ex.end3]
]

triples.outPath = [
  [ns.ex.start1, ns.ex.propertyA, links[0]],
  [ns.ex.start2, ns.ex.propertyB, links[1]],
  [links[0], ns.ex.propertyB, links[2]],
  [links[1], ns.ex.propertyB, links[3]],
  [links[2], ns.ex.propertyA, ns.ex.end1],
  [links[2], ns.ex.propertyA, ns.ex.end2],
  [links[2], ns.ex.propertyB, ns.ex.end1],
  [links[2], ns.ex.propertyB, ns.ex.end2],
  [links[3], ns.ex.propertyA, ns.ex.end1],
  [links[3], ns.ex.propertyA, ns.ex.end2],
  [links[3], ns.ex.propertyB, ns.ex.end1],
  [links[3], ns.ex.propertyB, ns.ex.end2]
]

const multi = {}

multi.addIn = () => {
  return createPathListDataset(triples.in, {
    start: 'object',
    end: 'subject',
    add: false,
    expect: [0, 2, 4, 6, 1, 3, 5, 7],
    subjects: terms.ends,
    objects: terms.starts
  })
}

multi.addInGraphs = () => {
  return createPathListDataset(triples.in, {
    start: 'object',
    end: 'subject',
    add: false,
    expect: [0, 2, 4, 6, 1, 3, 5, 7, 9, 11, 13, 15, 10, 12, 14, 16],
    subjects: terms.ends,
    objects: terms.starts,
    graphs: terms.graphs
  })
}

multi.addInPath = () => {
  const { edges, ...others } = createPathListDataset(triples.inPath, {
    start: 'object',
    end: 'subject',
    add: false,
    subjects: terms.ends
  })

  const ptrList = new PathList({
    factory,
    ptrs: [
      new Path({ edges: [edges[0], edges[2]], factory }),
      new Path({ edges: [edges[1], edges[3]], factory })
    ]
  })

  const expectedPtrLists = [
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[4]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[5]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[6]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[7]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[8]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[9]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[10]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[11]] })] })
  ]

  return { ...others, edges, expectedPtrLists, ptrList }
}

multi.addList = () => {
  return createPathListDataset(triples.list4, {
    add: false,
    items: terms.items
  })
}

multi.addListEmpty = () => {
  return createPathListDataset([
    [ns.ex.start1, ns.ex.propertyA, ns.rdf.nil],
    [ns.ex.start1, ns.ex.propertyB, ns.rdf.nil],
    [ns.ex.start2, ns.ex.propertyA, ns.rdf.nil],
    [ns.ex.start2, ns.ex.propertyB, ns.rdf.nil]
  ], {
    add: false,
    items: []
  })
}

multi.addListGraphs = () => {
  return createPathListDataset(triples.list4, {
    add: false,
    items: terms.items,
    graphs: terms.graphs
  })
}

multi.addOut = () => {
  return createPathListDataset(triples.out, {
    add: false,
    expect: [0, 1, 2, 3, 4, 5, 6, 7],
    objects: terms.ends
  })
}

multi.addOutGraphs = () => {
  return createPathListDataset(triples.out, {
    add: false,
    expect: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
    objects: terms.ends,
    graphs: terms.graphs
  })
}

multi.addOutPath = () => {
  const { edges, ...others } = createPathListDataset(triples.outPath, {
    add: false,
    objects: terms.ends
  })

  const ptrList = new PathList({
    factory,
    ptrs: [
      new Path({ edges: [edges[0], edges[2]], factory }),
      new Path({ edges: [edges[1], edges[3]], factory })
    ]
  })

  const expectedPtrLists = [
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[4]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[5]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[6]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[0], edges[2], edges[7]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[8]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[9]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[10]] })] }),
    new PathList({ ptrs: [new Path({ edges: [edges[1], edges[3], edges[11]] })] })
  ]

  return { ...others, edges, expectedPtrLists, ptrList }
}

multi.any = () => {
  return createPathListDataset([], { terms: [null] })
}

multi.clonePtrs = () => {
  const { ptrList, ptrs, ...others } = createPathListDataset(triples.out)

  const emptyPathList = new PathList({
    dataset: ptrList.dataset,
    factory: ptrList.factory,
    ptrs: []
  })

  return { ptrList: emptyPathList, ptrs, ...others }
}

multi.constructorGraphs = () => {
  return createPathListDataset([], {
    graphs: [ns.ex.graph1, ns.ex.graph2]
  })
}

multi.constructorPtrsVsTerms = () => {
  const { ...others } = createPathListDataset([])

  const terms = [ns.ex.deadEnd1, ns.ex.deadEnd2]

  return { ...others, terms }
}

multi.default = () => {
  return createPathListDataset([])
}

multi.deleteIn = () => {
  return createPathListDataset([
    ...triples.in,
    [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start2]
  ], {
    start: 'object',
    end: 'subject',
    expect: [9]
  })
}

multi.deleteInSubjects = () => {
  return createPathListDataset([
    ...triples.in,
    [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start2]
  ], {
    start: 'object',
    end: 'subject',
    expect: [8, 9],
    subjects: terms.ends
  })
}

multi.deleteList = () => {
  return createPathListDataset(triples.list2, {
    expect: []
  })
}

multi.deleteOut = () => {
  return createPathListDataset([
    ...triples.out,
    [ns.ex.start2, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    start: 'object',
    end: 'subject',
    expect: [9]
  })
}

multi.deleteOutObjects = () => {
  return createPathListDataset([
    ...triples.out,
    [ns.ex.start2, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    start: 'object',
    end: 'subject',
    expect: [8, 9],
    objects: terms.ends
  })
}

multi.empty = () => {
  return createPathListDataset([], { terms: [] })
}

multi.execute = () => {
  const { dataset, edges, ...others } = createPathListDataset([
    [ns.ex.start1, ns.ex.propertyA, ns.ex.end1],
    [ns.ex.end1, ns.ex.propertyB, ns.ex.end2],
    [ns.ex.start2, ns.ex.propertyA, ns.ex.end3],
    [ns.ex.start2, ns.ex.propertyC, ns.ex.deadEnd]
  ])

  const expectedPtrList = new PathList({
    ptrs: [
      new Path({ edges: [edges[0]] }),
      new Path({ edges: [edges[0], edges[1]] }),
      new Path({ edges: [edges[2]] })
    ]
  })

  return { ...others, dataset, edges, expectedPtrList }
}

multi.executeAll = () => {
  const { dataset, predicates, quads, ...others } = createPathListDataset([
    [ns.ex.start1, ns.ex.propertyA, links[0]],
    [ns.ex.end1, ns.ex.propertyB, links[0]],
    [ns.ex.start2, ns.ex.propertyA, links[1]],
    [ns.ex.end2, ns.ex.propertyB, links[1]],
    [ns.ex.start2, ns.ex.propertyA, ns.ex.deadEnd]
  ])

  const expectedPtrList = new PathList({
    ptrs: [
      new Path({
        edges: [
          new Edge({ dataset, quad: quads[0], start: 'subject', end: 'object' }),
          new Edge({ dataset, quad: quads[1], start: 'object', end: 'subject' })
        ]
      }),
      new Path({
        edges: [
          new Edge({ dataset, quad: quads[2], start: 'subject', end: 'object' }),
          new Edge({ dataset, quad: quads[3], start: 'object', end: 'subject' })
        ]
      })
    ]
  })

  const instructions = [{
    start: 'subject',
    end: 'object',
    predicates: [predicates[0]]

  }, {
    start: 'object',
    end: 'subject',
    predicates: [predicates[1]]
  }]

  return { ...others, dataset, expectedPtrList, instructions, predicates, quads }
}

multi.in = () => {
  return createPathListDataset([
    ...triples.in,
    [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start2]
  ], {
    start: 'object',
    end: 'subject',
    expect: [0, 4, 2, 6, 1, 5, 8, 3, 7]
  })
}

multi.inSubjects = () => {
  return createPathListDataset([
    ...triples.in,
    [ns.ex.deadEnd, ns.ex.propertyC, ns.ex.start2]
  ], {
    start: 'object',
    end: 'subject',
    expect: [0, 2, 4, 6, 1, 3, 5, 7],
    subjects: terms.ends
  })
}

multi.iterator = () => {
  const { dataset, terms, ...others } = createPathListDataset(triples.out)

  const expectedPtrLists = terms.map(term => new PathList({
    dataset,
    factory,
    terms: [term]
  }))

  return { ...others, expectedPtrLists }
}

multi.hasIn = () => {
  return createPathListDataset(triples.in, {
    start: 'object',
    end: 'object',
    expect: [0, 4, 2, 6, 1, 5, 8, 3, 7]
  })
}

multi.hasInSubject = () => {
  return createPathListDataset(triples.in, {
    start: 'object',
    end: 'object',
    expect: [0, 2, 4, 6, 1, 3, 5, 7],
    subjects: terms.ends
  })
}

multi.hasOut = () => {
  return createPathListDataset(triples.out, {
    start: 'subject',
    end: 'subject',
    expect: [0, 1, 2, 3, 4, 5, 8, 6, 7]
  })
}

multi.hasOutObjects = () => {
  return createPathListDataset(triples.out, {
    start: 'subject',
    end: 'subject',
    expect: [0, 1, 2, 3, 4, 5, 6, 7],
    objects: terms.ends
  })
}

multi.list = () => {
  const { dataset, edges, ...others } = createPathListDataset(triples.list2)

  const ptrList = new PathList({ dataset, factory, terms: [edges[0].term] })

  return { ...others, dataset, edges, items: terms.items, ptrList }
}

multi.out = () => {
  return createPathListDataset([
    ...triples.out,
    [ns.ex.start2, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [0, 1, 2, 3, 4, 5, 8, 6, 7]
  })
}

multi.outObjects = () => {
  return createPathListDataset([
    ...triples.out,
    [ns.ex.start2, ns.ex.propertyC, ns.ex.deadEnd]
  ], {
    expect: [0, 1, 2, 3, 4, 5, 6, 7],
    objects: terms.ends
  })
}

multi.quads = () => {
  const { edges, ...others } = createPathListDataset([
    [ns.ex.start1, ns.ex.propertyA, ns.ex.node1],
    [ns.ex.node1, ns.ex.propertyB, ns.ex.end1],
    [ns.ex.start2, ns.ex.propertyA, ns.ex.node2],
    [ns.ex.node2, ns.ex.propertyB, ns.ex.end2]
  ])

  const ptrList = new PathList({
    ptrs: [
      new Path({ edges: [edges[0], edges[1]] }),
      new Path({ edges: [edges[2], edges[3]] })
    ]
  })

  return { ...others, ptrList }
}

multi.trim = () => {
  const { dataset, edges, ...others } = createPathListDataset(triples.outPath)

  const ptrList = new PathList({
    factory,
    ptrs: [
      new Path({ edges: [edges[0], edges[2], edges[4]] }),
      new Path({ edges: [edges[0], edges[2], edges[5]] }),
      new Path({ edges: [edges[0], edges[2], edges[6]] }),
      new Path({ edges: [edges[0], edges[2], edges[7]] }),
      new Path({ edges: [edges[1], edges[3], edges[8]] }),
      new Path({ edges: [edges[1], edges[3], edges[9]] }),
      new Path({ edges: [edges[1], edges[3], edges[10]] }),
      new Path({ edges: [edges[1], edges[3], edges[11]] })
    ]
  })

  const expectedPtrList = new PathList({
    factory,
    ptrs: [
      new Path({ dataset, term: edges[4].term }),
      new Path({ dataset, term: edges[5].term }),
      new Path({ dataset, term: edges[6].term }),
      new Path({ dataset, term: edges[7].term }),
      new Path({ dataset, term: edges[8].term }),
      new Path({ dataset, term: edges[9].term }),
      new Path({ dataset, term: edges[10].term }),
      new Path({ dataset, term: edges[11].term })
    ]
  })

  return { ...others, dataset, edges, expectedPtrList, ptrList }
}

multi.clone = multi.out
multi.constructorPtrs = multi.out
multi.filter = multi.out
multi.map = multi.out

export default multi
