# Karma configuration
# Generated on Fri Jun 26 2015 16:26:37 GMT-0700 (PDT)

argv = require('optimist').argv


module.exports = (config) ->
  config.set

    # base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ''


    # frameworks to use
    # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai']


    # list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js'
      'node_modules/angular-mocks/angular-mocks.js'
      'angular-input-highlight.coffee'
      'test/*.spec.coffee'
    ]


    # list of files to exclude
    exclude: []


    # preprocess matching files before serving them to the browser
    # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors:
      '**/*.coffee': ['coffee']


    # test results reporter to use
    # possible values: 'dots', 'progress'
    # available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress']


    # web server port
    port: 9876


    # enable / disable colors in the output (reporters and logs)
    colors: true


    # level of logging
    # possible values:
    # - config.LOG_DISABLE
    # - config.LOG_ERROR
    # - config.LOG_WARN
    # - config.LOG_INFO
    # - config.LOG_DEBUG
    logLevel: config.LOG_INFO


    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true


    # start these browsers
    # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: if argv.quicktest then [
        'Chrome'
    ] else [
        'Chrome', 'Firefox', 'Safari', 'IE9 - Win7', 'IE10 - Win7', 'IE11 - Win7'
    ]


    # Continuous Integration mode
    # if true, Karma captures browsers, runs the tests and exits
    singleRun: false
