const path = require('path')


module.exports = {
	//mode : 'development',
	entry : './blocks/adverts/index.js',
	output : {
		filename : 'index.js',
		path : path.resolve(__dirname, 'blocks/adverts/built')
	},
	//devtool: 'inline-source-map',
	devServer : {
		contentBase : path.resolve(__dirname, 'blocks/adverts/built'),
		compress : true,
		port : 9000,
	},
	module: {
	  rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['@babel/preset-env','@babel/preset-react'],
	          cacheDirectory: true,
	        },
	      }
	    }
	  ]
	}
}