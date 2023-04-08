import { rebaseDataset } from './lib/rebase.js'
import { replaceDataset } from './lib/replace.js'
import sortByScore from './lib/sortByScore.js'
import toPathArray from './lib/toPathArray.js'
import toTerm from './lib/toTerm.js'
import toTermArray from './lib/toTermArray.js'
import Path from './Path.js'
import PathList from './PathList.js'

class Grapoi extends PathList {
  constructor ({ dataset, factory, ptrs, term, terms, graph, graphs }) {
    if (term || terms) {
      terms = terms || term
    }

    if (graph || graphs) {
      graphs = graphs || graph
    }

    if (!ptrs && terms) {
      ptrs = toPathArray(terms, { dataset, factory, graph: graphs })
    }

    super({ dataset, factory, ptrs, graphs })
  }

  _toTerm (value) {
    return toTerm(value, { factory: this.factory })
  }

  _toTermArray (values) {
    return toTermArray(values, { factory: this.factory })
  }

  addIn (predicates, subjects, callback) {
    if (typeof subjects === 'function') {
      callback = subjects
      subjects = null
    }

    if (!subjects) {
      subjects = [this.factory.blankNode()]
    }

    return super.addIn(this._toTermArray(predicates), this._toTermArray(subjects), callback)
  }

  addList (predicates, items) {
    return super.addList(this._toTermArray(predicates), this._toTermArray(items))
  }

  addOut (predicates, objects, callback) {
    if (typeof objects === 'function') {
      callback = objects
      objects = null
    }

    if (!objects) {
      objects = [this.factory.blankNode()]
    }

    return super.addOut(this._toTermArray(predicates), this._toTermArray(objects), callback)
  }

  best (score) {
    return this.score(score, { limit: 1 })
  }

  deleteIn (predicates, subjects) {
    return super.deleteIn(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  deleteList (predicates) {
    return super.deleteList(this._toTermArray(predicates))
  }

  deleteOut (predicates, objects) {
    return super.deleteOut(this._toTermArray(predicates), this._toTermArray(objects))
  }

  hasIn (predicates, subjects) {
    return super.hasIn(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  hasOut (predicates, objects) {
    return super.hasOut(this._toTermArray(predicates), this._toTermArray(objects))
  }

  in (predicates, subjects) {
    return super.in(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  out (predicates, objects) {
    return super.out(this._toTermArray(predicates), this._toTermArray(objects))
  }

  node (terms = null) {
    return super.node(this._toTermArray(terms))
  }

  rebase (base) {
    if (!base) {
      throw new Error('base parameter is required')
    }

    base = this._toTerm(base)

    for (const ptr of this.ptrs) {
      rebaseDataset(ptr.term, base, { factory: this.factory })(ptr.dataset)
    }

    return this.node(base)
  }

  replace (replacement) {
    if (!replacement) {
      throw new Error('replacement parameter is required')
    }

    replacement = this._toTerm(replacement)

    for (const ptr of this.ptrs) {
      replaceDataset(ptr.term, replacement, { factory: this.factory })(ptr.dataset)
    }

    return this.node(replacement)
  }

  score (score, { limit = Infinity, offset = 0 } = {}) {
    const ptrs = sortByScore(score(this))
      .slice(offset, offset + limit)
      .map(ptr => new Path({ ...ptr, factory: this.factory }))

    return this.clone({ ptrs })
  }
}

export default Grapoi
