import uuid from 'uuid'
import PubSub from 'PubSub'
import DecibelAnalyser from 'DecibelAnalyser'
import { registry, register, getById } from 'registry'

export default class DecibelMeter {

	constructor(id = uuid()) {
		this.id = id
		this.listening = false
		this.events = new PubSub(this)

		this._connection = null

		register(this)
	}

	get source() {
		return this._connection && this._connection.source ? this._connection.source : null
	}

	get connection() {
		return this._connection
	}

	get sources() {
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
			return navigator.mediaDevices.enumerateDevices().then(devices => devices.filter(device => device.kind === 'audioinput'))
		else
			return Promise.reject(new Error('MediaDevices.enumerateDevices() is not supported'))
	}

	get connected() {
		return this._connection !== null
	}

	on(eventName, callback) {
		this.events.on(eventName, callback)
		return callback
	}

	off(eventName = null, callback = null) {
		this.events.off(eventName, callback)
		return callback
	}

	listen() {
		if (!this.listening) {

			this.listening = true
			this.events.dispatch('change', this.listening)

			if (this.connection)
				this.connection.dBAnalyser.start()
		}

		return this
	}

	stopListening() {
		if (this.listening) {

			if (this.connection)
				this.connection.dBAnalyser.stop()

			this.listening = false
			this.events.dispatch('change', this.listening)
		}

		return this
	}

	listenTo(identifier, callback) {
		return this.connectTo(identifier).then(meter => {

			this.events.on('sample', callback)
			meter.listen()

			return this
		})
	}

	connect(source) {
		if (!(source instanceof MediaDeviceInfo))
			return Promise.reject(new TypeError('DecibelMeter: Expected first parameter to be of type MediaDeviceInfo'))
		else {

			// connection exists, and already connection to requested source

			if (this._connection && this._connection.source === source)
				return Promise.resolve(this)

			// audio source constraints

			const constraints = {
				audio: {
					mandatory: {
						sourceId: source.deviceId // force specific selected device
					}
				}
			}

			// connect

			return navigator.mediaDevices.getUserMedia(constraints).then(stream => {

				let previous = null, connection

				// already have a connection?

				if (this._connection) {

					// note previous source

					previous = this._connection.source

					// we already have a connection, but to a different source

					const oldSource = this._connection.source
					const oldStream = this._connection.stream

					// disconnect track for old source, if connected to stream

					const trackToDiscard = oldStream.getAudioTracks().find(track => track.label === oldSource.label)

					if (trackToDiscard) {
						trackToDiscard.stop()
						oldStream.removeTrack(trackToDiscard)
					}

					// stop analyzing dB

					this._connection.dBAnalyser.stop()

					// disconnect stream source

					this._connection.streamSource.disconnect()

					// discard old stream

					delete this._connection.stream
					delete this._connection.streamSource

					// set new properties

					connection = this._connection

					connection.source = source
					connection.stream = stream
					connection.streamSource = connection.context.createMediaStreamSource(stream)
					connection.streamSource.connect(connection.analyser)

				} else {

					// first time connecting

					connection = { stream, source, context: new AudioContext }

					connection.analyser = connection.context.createAnalyser()
					connection.analyser.smoothingTimeConstant = .5
					connection.lastSample = new Uint8Array(1)
					connection.streamSource = connection.context.createMediaStreamSource(stream)
					connection.streamSource.connect(connection.analyser)
					connection.dBAnalyser = new DecibelAnalyser(this)

					this._connection = connection
				}

				this.events.dispatch('connect', source, previous)

				// listening may have started prior to connecting, or source changed

				if (this.listening && !connection.dBAnalyser.running)
					connection.dBAnalyser.start()

				return this // finally, resolve with DecibelMeter itself
			})
		}
	}

	connectTo(identifier) {
		return this.sources.then(sources => {
			if (sources.length === 0)
				throw new ReferenceError('DecibelMeter: No audioinput sources available')

			if (typeof identifier === 'number')
				return sources[identifier] ? this.connect(sources[identifier]) : Promise.reject(new ReferenceError(`DecibelMeter: Source not found INDEX ${identifier}`))

			if (typeof identifier === 'string') {
				const source = sources.find(source => source.deviceId === identifier)

				return source ? this.connect(source) : Promise.reject(new ReferenceError(`DecibelMeter: Source not found DEVICEID ${identifier}`))
			}

			return Promise.reject(new TypeError('DecibelMeter: Invalid source identifier'))
		})
	}

	disconnect() {
		this.stopListening()

		if (this.connection) {
			this.connection.dBAnalyser.stop()
			this.connection.streamSource.disconnect()
			this.connection.stream.getAudioTracks().forEach(t => t.stop())
		}

		return new Promise(resolve => {
			setTimeout(() => {
				delete this._connection.stream
				delete this._connection.streamSource

				this._connection = null

				this.events.dispatch('disconnect')

				resolve(this)
			}, 100)
		})
	}

	static getMeterById(id) {
		return getById(id)
	}

	static get meters() {
		return registry()
	}
}
