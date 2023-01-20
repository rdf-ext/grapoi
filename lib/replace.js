function replaceDataset (oldTerm, newTerm, { factory }) {
  const rebase = replaceQuad(oldTerm, newTerm, { factory })

  return dataset => {
    const quads = [
      ...[...dataset.match(oldTerm)],
      ...[...dataset.match(null, oldTerm)],
      ...[...dataset.match(null, null, oldTerm)]
    ]

    for (const quad of quads) {
      const newQuad = rebase(quad)

      if (newQuad !== quad) {
        dataset.delete(quad)
        dataset.add(newQuad)
      }
    }
  }
}

function replaceQuad (oldTerm, newTerm, { factory }) {
  const replace = replaceTerm(oldTerm, newTerm)

  return quad => {
    const subject = replace(quad.subject)
    const predicate = replace(quad.predicate)
    const object = replace(quad.object)

    if (subject === quad.subject && predicate === quad.predicate && object === quad.object) {
      return quad
    }

    return factory.quad(subject, predicate, object, quad.graph)
  }
}

function replaceTerm (oldTerm, newTerm) {
  return term => {
    if (term.equals(oldTerm)) {
      return newTerm
    }

    return term
  }
}

export {
  replaceDataset,
  replaceQuad,
  replaceTerm
}
