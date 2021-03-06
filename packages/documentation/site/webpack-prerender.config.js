var path = require('path')
var webpack = require('webpack')
const CircularDependencyPlugin = require('circular-dependency-plugin')

var isDev = process.env.NODE_ENV !== 'production'
const root = path.join(__dirname, '..', '..', '..')

module.exports = {
	entry: path.join(__dirname, 'renderPath.js'),
	mode: isDev ? 'development' : 'production',
	output: {
		path: path.join(__dirname, '..', '__site_prerender__'),
		filename: 'renderPath.js',
		libraryTarget: 'commonjs2',
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.md$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: false,
						},
					},
					path.join(__dirname, '../scripts/markdownLoader'),
				],
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.ts(x|)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: 'null-loader',
			},
			{
				test: /\.less$/,
				use: 'null-loader',
			},
			{
				test: /\.png$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							query: {
								mimetype: 'image/png',
								name: 'images/[name]-[hash].[ext]',
							},
						},
					},
				],
			},
		],
	},

	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		modules: [
			path.join(__dirname, '..', 'node_modules'),
			path.join(root, 'node_modules'),
			path.join(root, 'packages', 'dnd-core', 'node_modules'),
			path.join(root, 'packages', 'react-dnd', 'node_modules'),
			path.join(root, 'packages', 'react-dnd-html5-backend', 'node_modules'),
		],
		alias: {
			'react-dnd/modules': path.join(root, 'packages/react-dnd/src'),
			'react-dnd': path.join(root, 'packages/react-dnd/src'),
			'react-dnd-html5-backend': path.join(
				root,
				'packages/react-dnd-html5-backend/src',
			),
			'dnd-core': path.join(root, 'packages/dnd-core/src'),
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__DEV__: JSON.stringify(isDev || true),
		}),
		new CircularDependencyPlugin({
			exclude: /node_modules/,
			failOnError: false,
			allowAsyncCycles: false,
			cwd: process.cwd(),
		}),
	],
}
