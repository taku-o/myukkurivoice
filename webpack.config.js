const path = require('path');

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
];
