const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BundleTracker = require('webpack-bundle-tracker');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ENV = process.env;

module.exports = (env, argv) => ({
  devtool: env.production ? 'hidden-source-map' : ENV.WEBPACK_DEVTOOL || 'eval-source-map',

  mode: 'production',
  
  // Rarely updated NPM packages are split out into 'vendor' bundle for long term caching.
  // A lot of things are lazy-loaded. That is set up in Routes.js
  entry: {
    app: {
      import: './src/app.js',
      dependOn: 'vendor',
    },
    vendor: [
      'history',
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
    // usedExports: true,
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

  externals: {
    geotiff: 'geotiff',
  },

  target: ['browserslist'],

  module: {
    rules: [
      {
        test: path.resolve(__dirname, 'node_modules/ajv'),
        use: 'null-loader',
      },
      {
        test: /\.(js|cjs|jsx)$/,
        use: ['babel-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
        type: 'javascript/auto',
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          // Roll styles into a separate file in /styles folder
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // There are a bunch of hardcoded paths within CSS that assume we have a URL structure of a Django app. This option makes sure those are not followed during build.
              url: false,
              sourceMap: true,
            },
          },
          {loader: 'postcss-loader', options: {sourceMap: true}},
          {loader: 'sass-loader', options: {sourceMap: true}},
        ],
      },
      {
        test: /\.min\.js$/,
        exclude: [/react/, /node_modules/],
        use: ['script-loader'],
      },
      {
        test: /node_modules\/vfile\/core\.js/,
        use: [
          {
            loader: 'imports-loader',
            options: {
              type: 'commonjs',
              imports: ['single process/browser process'],
            },
          },
        ],
      },
      {
        test: path.resolve(__dirname, 'node_modules/@mdi/js'),
        sideEffects: false,
      },
    ],
  },
  plugins: [
    new MomentLocalesPlugin(),
    new MiniCssExtractPlugin({filename: '[name]-[contenthash].css'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
    }),
    new BundleAnalyzerPlugin({analyzerMode: 'disabled', generateStatsFile: true}),
    new BundleTracker({filename: './assets/webpack-stats.json'}),
  ],
  resolve: {
    symlinks: false,
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      '@plotlyjs': path.resolve(__dirname, '../../../plotlyjs/static/plotlyjs'),
      '@common': path.resolve(__dirname, './src/common'),
      '@files': path.resolve(__dirname, './src/files'),
      '@dashboards': path.resolve(__dirname, './src/dashboards'),
      '@text': path.resolve(__dirname, './src/text'),
      '@settings': path.resolve(__dirname, './src/settings'),
      '@share': path.resolve(__dirname, './src/share'),
      '@userops': path.resolve(__dirname, './src/userops'),
      '@workspace': path.resolve(__dirname, './src/workspace'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@figures': path.resolve(__dirname, './src/figures'),
      _utils: path.resolve(__dirname, './src/utils'),
      // Optimization - we don't need both of those
      'lodash-es': 'lodash',
    },
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: false,
    },
  },
});
