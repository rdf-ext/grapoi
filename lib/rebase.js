const isIriRegExp = /^[a-z][a-z0-9+.-]*:/

function rebaseDataset (oldTerm, newTerm, { factory }) {
  const rebase = rebaseQuad(oldTerm, newTerm, { factory })

  return dataset => {
    for (const quad of [...dataset]) {
      const newQuad = rebase(quad)

      if (newQuad !== quad) {
        dataset.delete(quad)
        dataset.add(newQuad)
      }
    }
  }
}

function rebaseQuad (oldTerm, newTerm, { factory }) {
  const rebase = rebaseTerm(oldTerm, newTerm, { factory })

  return quad => {
    const subject = rebase(quad.subject)
    const predicate = rebase(quad.predicate)
    const object = rebase(quad.object)

    if (subject === quad.subject && predicate === quad.predicate && object === quad.object) {
      return quad
    }

    return factory.quad(subject, predicate, object, quad.graph)
  }
}

function rebaseTerm (oldTerm, newTerm, { factory }) {
  return term => {
    if (term.termType !== 'NamedNode') {
      return term
    }

    if (!term.value.startsWith(oldTerm.value)) {
      return term
    }

    if (isIriRegExp.test(term.value) !== isIriRegExp.test(oldTerm.value)) {
      return term
    }

    return factory.namedNode(newTerm.value + term.value.slice(oldTerm.value.length))
  }
}

export {
  rebaseDataset,
  rebaseQuad,
  rebaseTerm
}
