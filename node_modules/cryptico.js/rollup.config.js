/**
 * Created by naeemo on 2016/12/7.
 */
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

module.exports = {
    entry: 'src/api.js',
    dest: 'dist/cryptico.min.js',
    format: 'umd',
    moduleName: 'cryptico',
    plugins: [
        resolve({
            jsnext: false,
            main: true,
            browser: true
        }),
        commonjs(),
        uglify()
    ]
};