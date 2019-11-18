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
      rules: [{
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "./"),
        ],
        exclude: /node_modules/,
      }],
    },
    target: 'electron-main',
  },
  {
    entry: {
      main: './js/apps.main.js',
      dict: './js/apps.dict.js',
      help: './js/apps.help.js',
      helpsearch: './js/apps.helpsearch.js',
      system: './js/apps.system.js',
      spec: './js/apps.spec.js',
    },
    //mode: 'production',
    mode: 'development',
    output: {
      filename: 'renderer.[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        //{
        //  test: /ctrl\.main\.js$/,
        //  use: {
        //    loader: 'script-loader',
        //  },
        //},
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
        },
      ],
    },
    target: 'electron-renderer',
  },
];
