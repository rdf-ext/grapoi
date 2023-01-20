import grapoi from './index.js'

class Factory {
  grapoi ({ ...args } = {}) {
    if (!args.dataset && typeof this.dataset === 'function') {
      args.dataset = this.dataset()
    }

    return grapoi({ ...args, factory: this })
  }
}

Factory.exports = ['grapoi']

export default Factory
