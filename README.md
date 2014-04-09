# DecibelMeter

## Monitor dB Levels Using HTML5 Audio API

DecibelMeter allows you to monitor the noise level using your device's microphone(s) from within a web page or node-webkit application.

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

Start listening with audio source
```javascript
meter.listen(); // "sample" callback set above will now receive data
```

Stop listening with audio source
```javascript
meter.stopListening();
```

Disconnect from the audio source entirely
```javascript
meter.disconnect();
```






