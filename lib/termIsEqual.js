function termIsEqual (a, b) {
  if (a) {
    return a.equals(b)
  }

  return a === b
}

export default termIsEqual
