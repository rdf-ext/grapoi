class Edge {
  constructor ({ dataset, end, quad, start }) {
    this.dataset = dataset
    this.end = end
    this.quad = quad
    this.start = start
  }

  get term () {
    return this.quad[this.end]
  }

  get graph () {
    return this.quad.graph
  }

  get startTerm () {
    return this.quad[this.start]
  }
}

export default Edge
