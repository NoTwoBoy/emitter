/*
 * @Description: 订阅发布器
 * @Date: 2021-11-16 15:31:17
 * @LastEditTime: 2021-11-17 16:28:08
 * @FilePath: \emitter\emitter.js
 */

class Emitter {
  constructor() {
    this.events = new Map()
  }

  once(name, callback, context) {
    const self = this
    if (!this.events.get(name)) {
      this.events.set(name, [])
    }

    const listener = function() {
      self.off(name, listener, context)
      callback.apply(context, arguments)
    }

    return this.on(name, listener, context)
  }

  on(name, callback, context) {
    if (!this.events.has(name)) {
      this.events.set(name, [])
    }

    this.events.get(name).push({
      callback,
      context
    })

    return this
  }

  emit(name) {
    const args = [].slice.call(arguments, 1)

    if (this.events.has(name)) {
      const eventsArray = this.events.get(name).slice()
      eventsArray.forEach(event => {
        event.callback.apply(event.context, args)
      })
    }

    return this
  }

  off(name, callback) {
    let liveEvents = []

    if (this.events.has(name)) {
      const currentEvents = this.events.get(name)
      if (currentEvents.length && callback) {
        currentEvents.forEach(event => {
          if (event.callback !== callback && event.callback._ !== callback)
            liveEvents.push(callback)
        })
      }
    }

    liveEvents.length
      ? this.events.set(name, liveEvents)
      : this.events.delete(name)

    return this
  }
}

const emitter = new Emitter()

export default emitter
