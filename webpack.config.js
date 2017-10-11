const webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
	BabiliPlugin = require('babili-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {
	entry: {
		'polyfills': './src/polyfills.ts',
		'vendor': './src/vendor.ts',
		'app': './src/main.ts'
	},

	resolve: {
		extensions: ['.ts', '.js', '.css']
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].chunk.js'
	},

	module: {
		rules: [
			{
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          }, 'angular2-template-loader'
        ]
      },
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file-loader?name=assets/[name].[hash].[ext]'
			},
			{
				test: /\.css$/,
				include: path.resolve(__dirname, 'src'),
				use: [{
					loader: 'to-string-loader'
				}, {
					loader: 'css-loader', options: { minimize: true }
				}]
			}
		]
	},

	plugins: [
		// Workaround for angular/angular#11580
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			path.resolve(__dirname, './src') // location of your src
		),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),
		new BabiliPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			// https://github.com/angular/angular/issues/10618
			mangle: {
				keep_fnames: true,
				screw_ie8: true,
			},
			compress: {
				warnings: true,
				screw_ie8: true
			},
			output: { comments: false },
			sourceMap: false,
			beautify: false,
			comments: false
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		}),
		new ExtractTextPlugin('[name].[hash].css'),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		}),
		new webpack.LoaderOptionsPlugin({
			htmlLoader: {
				minimize: false // workaround for ng2
			}
		}),
		new webpack.DefinePlugin({
			'ENV': ENV
		})
	]
};
