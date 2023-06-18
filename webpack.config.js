// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { EsbuildPlugin } = require('esbuild-loader');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';
const esbuildOptions = { target: 'es2021' };

const config = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  resolve: {
    alias: {
      canvas$: false,
      bufferutil$: false,
      'utf-8-validate$': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: esbuildOptions,
      },

      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  optimization: {
    minimizer: [new EsbuildPlugin(esbuildOptions)],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
