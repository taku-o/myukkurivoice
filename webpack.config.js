const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = [
  {
    entry: './electron.js',
    //mode: 'production',
    mode: 'development',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, './')],
          exclude: /node_modules/,
        },
      ],
    },
    target: 'electron-main',
  },
  {
    entry: {
      main: './webpack/renderer.main.bundle.js',
      dict: './webpack/renderer.dict.bundle.js',
      help: './webpack/renderer.help.bundle.js',
      helpsearch: './webpack/renderer.helpsearch.bundle.js',
      system: './webpack/renderer.system.bundle.js',
      spec: './webpack/renderer.spec.bundle.js',
    },
    //mode: 'production',
    mode: 'development',
    output: {
      filename: 'renderer.[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
        },
      ],
    },
    target: 'electron-renderer',
  },
  {
    entry: {
      main: './webpack/style.main.bundle.js',
      dict: './webpack/style.dict.bundle.js',
      help: './webpack/style.help.bundle.js',
      helpsearch: './webpack/style.helpsearch.bundle.js',
      system: './webpack/style.system.bundle.js',
    },
    //mode: 'production',
    mode: 'development',
    output: {
      filename: 'style.[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']}],
    },
    plugins: [new MiniCssExtractPlugin({filename: 'style.[name].css'})],
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
  },
];
