import Edge from './Edge.js'
import Grapoi from './Grapoi.js'
import Path from './Path.js'
import PathList from './PathList.js'

function grapoi (args) {
  return new Grapoi(args)
}

export {
  grapoi as default,
  Edge,
  Grapoi,
  Path,
  PathList
}
