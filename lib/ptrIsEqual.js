import termIsEqual from './termIsEqual.js'

function ptrIsEqual (a, b) {
  if (a.dataset !== b.dataset) {
    return false
  }

  if (!termIsEqual(a.graph, b.graph)) {
    return false
  }

  if (!termIsEqual(a.term, b.term)) {
    return false
  }

  return true
}

export default ptrIsEqual
