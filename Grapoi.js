import { rebaseDataset } from './lib/rebase.js'
import { replaceDataset } from './lib/replace.js'
import sortByScore from './lib/sortByScore.js'
import toPathArray from './lib/toPathArray.js'
import toTerm from './lib/toTerm.js'
import toTermArray from './lib/toTermArray.js'
import Path from './Path.js'
import PathList from './PathList.js'

/**
 * A graph pointer object
 * @extends PathList
 */
class Grapoi extends PathList {
  /**
   * Create a new instance
   * @param {DatasetCore} dataset Dataset for the pointers
   * @param {Environment} factory Factory for new quads
   * @param {Path[]} ptrs Use existing pointers
   * @param {Term} term Term for the pointers
   * @param {Term[]} terms Terms for the pointers
   * @param {Term} graph Graph for the pointers
   * @param {Term[]} graphs Graphs for graph pointers
   */
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

  /**
   * Add quad(s) with the current terms as the object
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {Grapoi} this
   */
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

  /**
   * Add list(s) with the given items
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the lists
   * @param {Grapoi|Grapoi[]|Term|Term[]} [items] List items
   * @returns {Grapoi} this
   */
  addList (predicates, items) {
    return super.addList(this._toTermArray(predicates), this._toTermArray(items))
  }

  /**
   * Add quad(s) with the current terms as the subject
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {Grapoi} this
   */
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

  /**
   * Use the given score function on all pointers and return the pointer with the best score.
   * @param {function} score Score function
   * @returns {Constructor} Instance with a single pointer with the best score
   */
  best (score) {
    return this.score(score, { limit: 1 })
  }

  /**
   * Delete quad(s) with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Grapoi} this
   */
  deleteIn (predicates, subjects) {
    return super.deleteIn(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  /**
   * Delete list(s).
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the lists
   * @returns {Grapoi} this
   */
  deleteList (predicates) {
    return super.deleteList(this._toTermArray(predicates))
  }

  /**
   * Delete quad(s) with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Constructor} this
   */
  deleteOut (predicates, objects) {
    return super.deleteOut(this._toTermArray(predicates), this._toTermArray(objects))
  }

  /**
   * Filter the pointers based on matching quad(s) with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasIn (predicates, subjects) {
    return super.hasIn(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  /**
   * Filter the pointers based on matching quad(s) with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasOut (predicates, objects) {
    return super.hasOut(this._toTermArray(predicates), this._toTermArray(objects))
  }

  /**
   * Traverse the graph with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  in (predicates, subjects) {
    return super.in(this._toTermArray(predicates), this._toTermArray(subjects))
  }

  /**
   * Traverse the graph with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  out (predicates, objects) {
    return super.out(this._toTermArray(predicates), this._toTermArray(objects))
  }

  /**
   * Jump to random terms.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Terms for the new pointers
   * @returns {Constructor} Instance with pointers of the selected terms
   */
  node (terms = null) {
    return super.node(this._toTermArray(terms))
  }

  /**
   * Rebase all terms of the current pointers with a new base.
   * @param {Grapoi|Grapoi[]|Term|Term[]} base New base of the terms
   * @returns {Constructor} Instance with a single pointer with the new base as the term
   */
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

  /**
   * Replace all terms of the current pointers with another term.
   * @param {Grapoi|Grapoi[]|Term|Term[]} replacement Term used as replacement
   * @returns {Constructor} Instance with a single pointer with the replacement as the term
   */
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

  /**
   * Score the pointers and sort them by score value.
   * @param {Function} score @rdfjs/score compatible score function
   * @param {Number} [limit] Limit for the result pointers
   * @param {Number} [offset] Offset for the result pointers
   * @returns {Constructor} Instance of the scored pointers, sorted and sliced.
   */
  score (score, { limit = Infinity, offset = 0 } = {}) {
    const ptrs = sortByScore(score(this))
      .slice(offset, offset + limit)
      .map(ptr => new Path({ ...ptr, factory: this.factory }))

    return this.clone({ ptrs })
  }
}

export default Grapoi
