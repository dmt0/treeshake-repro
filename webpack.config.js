const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ENV = process.env;

module.exports = (env, argv) => ({
  devtool: env.production ? 'hidden-source-map' : ENV.WEBPACK_DEVTOOL || 'eval-source-map',

  mode: 'production',
  
  entry: {
    app: {
      import: './src/app.js',
      dependOn: 'vendor',
    },
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
    ],
  },

  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js',
    path: path.join(__dirname, 'assets'),
    publicPath: '/static/webapp/assets/',
  },

  optimization: {
    splitChunks: {
      // Don't split out node modules into separate chunks
      cacheGroups: {defaultVendors: false},
    },
    providedExports: true,
    usedExports: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            passes: 3,
          },
        },
      }),
    ],
  },

  target: ['browserslist'],

  module: {
    rules: [
      {
        test: /\.(js|cjs|jsx)$/,
        use: ['babel-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.min\.js$/,
        exclude: [/react/, /node_modules/],
        use: ['script-loader'],
      },
      {
        test: path.resolve(__dirname, 'node_modules/@mdi/js'),
        sideEffects: false,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
    }),
    new BundleAnalyzerPlugin({analyzerMode: 'disabled', generateStatsFile: true}),
  ],
  resolve: {
    symlinks: false,
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
});
