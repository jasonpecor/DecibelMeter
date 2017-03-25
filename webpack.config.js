const path = require('path')

module.exports = {

	entry: path.resolve(__dirname, 'src'),

	output: {

		path: path.resolve(__dirname, 'dist'),

		filename: 'decibel-meter.js',

		library: 'DecibelMeter',

		libraryTarget: 'umd'
	},

	module: {

		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				/*options: {
					presets: ['es2015', 'stage-3'],
					plugins: ['add-module-exports']
				}*/
			}
		]
	},

	resolve: {

		modules: [
			'node_modules',
			path.resolve(__dirname, 'src')
		],

		extensions: ['.js']
	},

	devtool: 'source-map',

	context: __dirname,

	target: 'web',

	stats: 'errors-only'
}
