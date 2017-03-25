(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DecibelMeter"] = factory();
	else
		root["DecibelMeter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(5);

var _uuid2 = _interopRequireDefault(_uuid);

var _PubSub = __webpack_require__(2);

var _PubSub2 = _interopRequireDefault(_PubSub);

var _DecibelAnalyser = __webpack_require__(1);

var _DecibelAnalyser2 = _interopRequireDefault(_DecibelAnalyser);

var _registry = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DecibelMeter = function () {
	function DecibelMeter() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _uuid2.default)();

		_classCallCheck(this, DecibelMeter);

		this.id = id;
		this.listening = false;
		this.events = new _PubSub2.default(this);

		this._connection = null;

		(0, _registry.register)(this);
	}

	_createClass(DecibelMeter, [{
		key: 'on',
		value: function on(eventName, callback) {
			this.events.on(eventName, callback);
			return callback;
		}
	}, {
		key: 'off',
		value: function off() {
			var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			this.events.off(eventName, callback);
			return callback;
		}
	}, {
		key: 'listen',
		value: function listen() {
			if (!this.listening) {

				this.listening = true;
				this.events.dispatch('change', this.listening);

				if (this.connection) this.connection.dBAnalyser.start();
			}

			return this;
		}
	}, {
		key: 'stopListening',
		value: function stopListening() {
			if (this.listening) {

				if (this.connection) this.connection.dBAnalyser.stop();

				this.listening = false;
				this.events.dispatch('change', this.listening);
			}

			return this;
		}
	}, {
		key: 'listenTo',
		value: function listenTo(identifier, callback) {
			var _this = this;

			return this.connectTo(identifier).then(function (meter) {

				_this.events.on('sample', callback);
				meter.listen();

				return _this;
			});
		}
	}, {
		key: 'connect',
		value: function connect(source) {
			var _this2 = this;

			if (!(source instanceof MediaDeviceInfo)) return Promise.reject(new TypeError('DecibelMeter: Expected first parameter to be of type MediaDeviceInfo'));else {

				// connection exists, and already connection to requested source

				if (this._connection && this._connection.source === source) return Promise.resolve(this);

				// audio source constraints

				var constraints = {
					audio: {
						mandatory: {
							sourceId: source.deviceId // force specific selected device
						}
					}
				};

				// connect

				return navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

					var previous = null,
					    connection = void 0;

					// already have a connection?

					if (_this2._connection) {

						// note previous source

						previous = _this2._connection.source;

						// we already have a connection, but to a different source

						var oldSource = _this2._connection.source;
						var oldStream = _this2._connection.stream;

						// disconnect track for old source, if connected to stream

						var trackToDiscard = oldStream.getAudioTracks().find(function (track) {
							return track.label === oldSource.label;
						});

						if (trackToDiscard) {
							trackToDiscard.stop();
							oldStream.removeTrack(trackToDiscard);
						}

						// stop analyzing dB

						_this2._connection.dBAnalyser.stop();

						// disconnect stream source

						_this2._connection.streamSource.disconnect();

						// discard old stream

						delete _this2._connection.stream;
						delete _this2._connection.streamSource;

						// set new properties

						connection = _this2._connection;

						connection.source = source;
						connection.stream = stream;
						connection.streamSource = connection.context.createMediaStreamSource(stream);
						connection.streamSource.connect(connection.analyser);
					} else {

						// first time connecting

						connection = { stream: stream, source: source, context: new AudioContext() };

						connection.analyser = connection.context.createAnalyser();
						connection.analyser.smoothingTimeConstant = .5;
						connection.lastSample = new Uint8Array(1);
						connection.streamSource = connection.context.createMediaStreamSource(stream);
						connection.streamSource.connect(connection.analyser);
						connection.dBAnalyser = new _DecibelAnalyser2.default(_this2);

						_this2._connection = connection;
					}

					_this2.events.dispatch('connect', source, previous);

					// listening may have started prior to connecting, or source changed

					if (_this2.listening && !connection.dBAnalyser.running) connection.dBAnalyser.start();

					return _this2; // finally, resolve with DecibelMeter itself
				});
			}
		}
	}, {
		key: 'connectTo',
		value: function connectTo(identifier) {
			var _this3 = this;

			return this.sources.then(function (sources) {
				if (sources.length === 0) throw new ReferenceError('DecibelMeter: No audioinput sources available');

				if (typeof identifier === 'number') return sources[identifier] ? _this3.connect(sources[identifier]) : Promise.reject(new ReferenceError('DecibelMeter: Source not found INDEX ' + identifier));

				if (typeof identifier === 'string') {
					var source = sources.find(function (source) {
						return source.deviceId === identifier;
					});

					return source ? _this3.connect(source) : Promise.reject(new ReferenceError('DecibelMeter: Source not found DEVICEID ' + identifier));
				}

				return Promise.reject(new TypeError('DecibelMeter: Invalid source identifier'));
			});
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			var _this4 = this;

			this.stopListening();

			if (this.connection) {
				this.connection.dBAnalyser.stop();
				this.connection.streamSource.disconnect();
				this.connection.stream.getAudioTracks().forEach(function (t) {
					return t.stop();
				});
			}

			return new Promise(function (resolve) {
				setTimeout(function () {
					delete _this4._connection.stream;
					delete _this4._connection.streamSource;

					_this4._connection = null;

					_this4.events.dispatch('disconnect');

					resolve(_this4);
				}, 100);
			});
		}
	}, {
		key: 'source',
		get: function get() {
			return this._connection && this._connection.source ? this._connection.source : null;
		}
	}, {
		key: 'connection',
		get: function get() {
			return this._connection;
		}
	}, {
		key: 'sources',
		get: function get() {
			if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) return navigator.mediaDevices.enumerateDevices().then(function (devices) {
				return devices.filter(function (device) {
					return device.kind === 'audioinput';
				});
			});else return Promise.reject(new Error('MediaDevices.enumerateDevices() is not supported'));
		}
	}, {
		key: 'connected',
		get: function get() {
			return this._connection !== null;
		}
	}], [{
		key: 'getMeterById',
		value: function getMeterById(id) {
			return (0, _registry.getById)(id);
		}
	}, {
		key: 'meters',
		get: function get() {
			return (0, _registry.registry)();
		}
	}]);

	return DecibelMeter;
}();

exports.default = DecibelMeter;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DecibelAnalyser = function () {
	_createClass(DecibelAnalyser, [{
		key: 'running',
		get: function get() {
			return this._running;
		}
	}]);

	function DecibelAnalyser(meter) {
		_classCallCheck(this, DecibelAnalyser);

		this.meter = meter;
		this._running = false;
	}

	_createClass(DecibelAnalyser, [{
		key: 'update',
		value: function update() {
			var _this = this;

			var _meter$connection = this.meter.connection,
			    analyser = _meter$connection.analyser,
			    lastSample = _meter$connection.lastSample;


			analyser.getByteFrequencyData(lastSample);

			//console.log('audio sample', lastSample)

			var value = lastSample[0];
			var percent = value / 255;
			var dB = analyser.minDecibels + (analyser.maxDecibels - analyser.minDecibels) * percent;

			this.meter.events.dispatch('sample', dB, value, percent, analyser.minDecibels, analyser.maxDecibels);

			if (this._running) requestAnimationFrame(function () {
				return _this.update();
			});
		}
	}, {
		key: 'start',
		value: function start() {
			this._running = true;
			this.update();
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._running = false;
		}
	}]);

	return DecibelAnalyser;
}();

exports.default = DecibelAnalyser;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = function () {
	function PubSub(context) {
		_classCallCheck(this, PubSub);

		this.context = context;
		this.eventIndex = {};
	}

	_createClass(PubSub, [{
		key: "index",
		value: function index(eventName) {
			return this.eventIndex[eventName] ? this.eventIndex[eventName] : this.eventIndex[eventName] = [];
		}
	}, {
		key: "on",
		value: function on(eventName, callback) {
			this.index(eventName).push(callback);
		}
	}, {
		key: "off",
		value: function off() {
			var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


			// remove all callbacks

			if (eventName === null) return this.eventIndex = {};

			var index = this.index(eventName);

			// remove all callbacks for eventName

			if (callback === null) return index.splice(0);

			// remove specific callback for eventName

			if (index.includes(callback)) index.splice(index.indexOf(callback), 1);
		}
	}, {
		key: "dispatch",
		value: function dispatch(eventName) {
			var _this = this;

			for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				params[_key - 1] = arguments[_key];
			}

			this.index(eventName).forEach(function (callback) {
				return callback.apply(_this.context, params);
			});
		}
	}]);

	return PubSub;
}();

exports.default = PubSub;
module.exports = exports["default"];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DecibelMeter = __webpack_require__(0);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DecibelMeter).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.registry = registry;
exports.register = register;
exports.getById = getById;
function registry() {
	if (typeof navigator.__decibelMeters === 'undefined') navigator.__decibelMeters = {};
	return navigator.__decibelMeters;
}

function register(meter) {
	return registry()[meter.id] = meter;
}

function getById(id) {
	return registry()[id] || null;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;
function uuid() {
  var d = performance.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=decibel-meter.js.map