function baseDataset (newBaseTerm, { factory }) {
  const base = baseQuad(newBaseTerm, { factory })

  return dataset => {
    for (const quad of [...dataset]) {
      const newQuad = base(quad)

      if (newQuad !== quad) {
        dataset.delete(quad)
        dataset.add(newQuad)
      }
    }
  }
}

function baseQuad (newBaseTerm, { factory }) {
  const base = baseTerm(newBaseTerm, { factory })

  return quad => {
    const subject = base(quad.subject)
    const predicate = base(quad.predicate)
    const object = base(quad.object)

    if (subject === quad.subject && predicate === quad.predicate && object === quad.object) {
      return quad
    }

    return factory.quad(subject, predicate, object, quad.graph)
  }
}

function baseTerm (newBaseTerm, { factory }) {
  return term => {
    if (term.termType !== 'NamedNode') {
      return term
    }

    if (/^[a-z]+:\/\//.test(term.value)) {
      return term
    }

    return factory.namedNode(new URL(term.value, newBaseTerm.value).toString())
  }
}

export {
  baseDataset,
  baseQuad,
  baseTerm
}
