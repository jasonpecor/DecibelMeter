
export function registry() {
	if (typeof navigator.__decibelMeters === 'undefined')
		navigator.__decibelMeters = {}
	return navigator.__decibelMeters
}

export function register(meter) {
	return registry()[meter.id] = meter
}

export function getById(id) {
	return registry()[id] || null
}
