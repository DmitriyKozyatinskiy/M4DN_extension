const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const node_dir = __dirname + '/node_modules';

plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    jquery: "jquery",
    "window.jQuery": "jquery",
    "window.jquery": "jquery"
  }),
  new ExtractTextPlugin('bundle.css', { allChunks: true })
];

productionPlugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    compress: {
      warnings: false
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat(productionPlugins);
}

module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    background: "./src/background/background.js",
    options: "./src/options/options.js"
    //bootstrap: 'bootstrap-loader',
  },
  debug: true,

  output: {
    path: path.join(__dirname, 'extension/build'),
    filename: "[name]-bundle.js",
    publicPath: "chrome-extension://fcopcnfdpgpnejkiegmdglhpcfbilkci/build/"
  },

  externals: [
    {
      "window": "window"
    }
  ],

  resolve: {
    extensions: ['', '.js']
  },

  plugins: plugins,

  module: {
    // preLoaders: [
    //     {
    //         test: /\.js/,
    //         loader: 'eslint-loader',
    //         exclude: /node_modules/
    //     }
    // ],
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.html/, loader: 'html' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      { test: /\.json$/, loaders: ['json']},
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },
      { test: /node_modules\/.+\.(jsx|js)$/,
        loader: 'imports?jQuery=jquery,$=jquery,this=>window'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  postcss: [autoprefixer]
};