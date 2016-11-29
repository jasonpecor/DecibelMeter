# DecibelMeter

## Monitor dB Levels Using HTML5 Audio API

DecibelMeter allows you to monitor the noise level using your device's microphone(s) from within a web page or [node-webkit](https://github.com/rogerwang/node-webkit) application.

### Browser Support

I have only tested this in Chrome for Windows and Chrome for Mac.

### Live Example

You can try the DecibelMeter now: [DecibelMeter example](https://www.jasonpecor.com/code/DecibelMeter/example/example.html)

### Usage Examples

Create a decibel meter
```javascript
var meter = DecibelMeter.create('unique-id');
```

Get a list of audio sources on the device
```javascript
var audioSources;

meter.on('ready', function (meter, sources) {
  audioSources = sources;
});
```

Connect to an audio source
```javascript
meter.connect(audioSources[0]); // connect to first source, assumes meter is ready
```

Do something with the decibel data
```javascript
var level = document.getElementById('db-level');

meter.on('sample', function (dB, percent, value) {
  level.innerHTML = dB + ' dB'; // display current dB level
});
```

Start listening to audio source
```javascript
meter.listen(); // "sample" callback set above will now receive data
```

Stop listening to audio source
```javascript
meter.stopListening();
```

Disconnect from the audio source entirely
```javascript
meter.disconnect();
```

Multiple meters on one page
```javascript
var meter1 = DecimelMeter.create('meter-1');
var meter2 = DecimelMeter.create('meter-2');

var meters = DecimelMeter.getMeters(); // all meters created on this page

meter1 === DecimelMeter.getMeterById('meter-1'); // true
```






