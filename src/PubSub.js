export default class PubSub {

	constructor(context) {
		this.context = context
		this.eventIndex = {}
	}

	index(eventName) {
		return this.eventIndex[eventName] ? this.eventIndex[eventName] : this.eventIndex[eventName] = []
	}

	on(eventName, callback) {
		this.index(eventName).push(callback)
	}

	off(eventName = null, callback = null) {

		// remove all callbacks

		if (eventName === null)
			return this.eventIndex = {}

		const index = this.index(eventName)

		// remove all callbacks for eventName

		if (callback === null)
			return index.splice(0)

		// remove specific callback for eventName

		if (index.includes(callback))
			index.splice(index.indexOf(callback), 1)
	}

	dispatch(eventName, ...params) {
		this.index(eventName).forEach(callback => callback.apply(this.context, params))
	}
}
