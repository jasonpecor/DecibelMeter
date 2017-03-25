# DecibelMeter

## Monitor dB Levels Using HTML5 Audio API

DecibelMeter allows you to monitor the noise level using your device's microphone(s) from within a web page or [node-webkit](https://github.com/rogerwang/node-webkit) application.

```javascript
// connect to first audio input device found
new DecibelMeter.listenTo(0, (dB, percent, value) => console.log(dB))
```

### Browser Support

I have tested this in Chrome and Firefox for Windows and Android.
iOS support is not available yet.

### Live Example

You can try the DecibelMeter now: [DecibelMeter example](https://www.jasonpecor.com/code/DecibelMeter/example/2.0/example.html)


### Installation

`npm install --save decibel-meter`

### Usage Examples

Import `DecibelMeter` as ES6 module

```javascript
import DecibelMeter from 'decibel-meter'
```

Or, using a script tag

```html
<script src="decibel-meter.js"></script>
```

Create a decibel meter
```javascript
const meter = new DecibelMeter('unique-id');
```

Get a list of audio sources on the device
```javascript
// resolves with array of MediaDeviceInfo objects, filtered by type: audioinput
meter.sources.then(sources => console.log(sources))
```

Connect to an audio source
```javascript

// first method

meter.sources.then(sources => {
	meter.connect(sources[0])
})

// second method

meter.connectTo('default') // find audioinput by deviceId, and connect if possible
meter.connectTo(0) // find the first audioinput, and connect if possible

// handling errors

meter.connectTo('not-real').catch(err => alert('Connection Error'))
```

Do something with the decibel data
```javascript
const level = document.getElementById('db-level')

meter.on('sample', (dB, percent, value) => level.textContent = `${dB} dB`) // display current dB level
```

Start listening to audio source
```javascript
meter.listen() // "sample" callback set above will now receive data
```

Stop listening to audio source
```javascript
meter.stopListening()
```

Disconnect from the audio source entirely
```javascript
meter.disconnect() // returns Promise
```

Connect to a source, add a 'sample' event listener, and start listening to the connected source, in one terse command
```javascript
meter.listenTo(0, (dB, percent, value) => level.textContent = `${dB} dB`)
```

Multiple meters on one page
```javascript
var meter1 = new DecibelMeter('meter-1')
var meter2 = new DecibelMeter('meter-2')

DecimelMeter.meters // all meters created on this page

meter1 === DecimelMeter.getMeterById('meter-1'); // true
```

### Events

DecibelMeter has its own events dispatcher, and supports the following Events

- `change`
- `connect`
- `disconnect`
- `sample`

`change` - the meter's `listening` state has changed

```javascript
meter.on('change', listening => {
	if (listening)
		level.classList.add('active')
	else
		level.classList.remove('active')
})
```

`connect` - the meter successfully connected to an audioinput

```javascript
meter.on('connect', (source, previous) => {
	console.log(`
		Connected to ${source.label}
		Disconnected from ${previous.label}`
	)
})
```

`disconnect` - the meter was disconnected from a source

`sample` - the meter received decibel data from the source
