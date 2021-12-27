export class Emitter {
  constructor() {
    this.events = new Map()
    this.eventsCaches = new Map()
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

    if (this.eventsCaches.has(name)) {
      const eventsCachesArray = this.eventsCaches.get(name).slice()
      eventsCachesArray.forEach(event => {
        callback.apply(context, event.args)
      })
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
    if (!this.eventsCaches.has(name)) {
      this.eventsCaches.set(name, [])
    }

    this.eventsCaches.get(name).push({
      args
    })

    return this
  }

  off(name, callback) {
    let liveEvents = []

    if (this.events.has(name)) {
      const currentEvents = this.events.get(name)
      if (currentEvents.length && callback) {
        currentEvents.forEach(event => {
          if (event.callback !== callback && event.callback?._ !== callback)
            liveEvents.push(callback)
        })
      }
    }

    liveEvents.length
      ? this.events.set(name, liveEvents)
      : this.events.delete(name)

    return this
  }

  clear(names, option) {
    names = names ?? []
    option = option ?? {}
    const { isClearExcludesCaches } = option

    const excludes = names.map(name => {
      return {
        name,
        event: this.events.get(name),
        eventCache: this.eventsCaches.get(name)
      }
    })

    this.events = new Map()
    this.eventsCaches = new Map()

    excludes.forEach(item => {
      item.event && this.events.set(item.name, item.event)
      !isClearExcludesCaches &&
        item.eventCache &&
        this.eventsCaches.set(item.name, item.eventCache)
    })
  }
}

export const initEmitter = (function() {
  let emit = null
  return function() {
    return emit || (emit = new Emitter())
  }
})()
