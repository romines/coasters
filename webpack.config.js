/* eslint-env node */
var path = require('path')
var webpack = require('webpack')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            test: /\.s[a|c]ss$/,
            scss: 'style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /functions/,
          /utilities/
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
      // ,
      // {
      //   test: /\.s[a|c]ss$/,
      //   loader: 'style-loader!css-loader!sass-loader'
      // }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
        'vue$': 'vue/dist/vue.js'
    }
  }

}

if (process.env.NODE_ENV === 'development') {
  // dev has no uglify
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        FIREBASE: '"development"'
      }
    })
  ])
} else {
  module.exports.devtool = '#source-map'

  const base = [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ];

  const stagingEnvVars = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"staging"',
        FIREBASE: '"staging"'
      }
    })
  ]

  const productionEnvVars = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        FIREBASE: '"production"'
      }
    })
  ]

  if (process.env.FIREBASE === 'staging') {
    module.exports.plugins = (module.exports.plugins || []).concat(...stagingEnvVars, ...base)
  } else {
    module.exports.plugins = (module.exports.plugins || []).concat(...productionEnvVars, ...base)
  }
}