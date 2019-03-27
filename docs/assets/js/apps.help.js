"use strict";
angular.module('helpApp', ['helpControllers'])
    .config(['$qProvider', '$compileProvider', function ($qProvider, $compileProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        $compileProvider.debugInfoEnabled(false);
    }]);
