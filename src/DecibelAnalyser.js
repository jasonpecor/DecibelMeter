export default class DecibelAnalyser {

	get running() {
		return this._running
	}

	constructor(meter) {
		this.meter = meter
		this._running = false
	}

	update() {
		let { analyser, lastSample } = this.meter.connection

		analyser.getByteFrequencyData(lastSample)

		//console.log('audio sample', lastSample)

		let value = lastSample[0]
		let percent = value / 255
		let dB = analyser.minDecibels + ((analyser.maxDecibels - analyser.minDecibels) * percent)

		this.meter.events.dispatch('sample', dB, value, percent, analyser.minDecibels, analyser.maxDecibels)

		if (this._running)
			requestAnimationFrame(() => this.update())
	}

	start() {
		this._running = true
		this.update()
	}

	stop() {
		this._running = false
	}
}
