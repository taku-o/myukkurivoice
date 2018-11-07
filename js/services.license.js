"use strict";
var _exec, exec = function () { _exec = _exec || require('child_process').exec; return _exec; };
var _cryptico, cryptico = function () { _cryptico = _cryptico || require('cryptico.js'); return _cryptico; };
var _epath, epath = function () { _epath = _epath || require('electron-path'); return _epath; };
var unpackedPath = epath().getUnpackedPath();
// angular license service
angular.module('yvoiceLicenseService', [])
    .factory('LicenseService', ['$q', function ($q) {
        var consumerKeyCache = {};
        // encrypt decrypt
        var encrypt = function (passPhrase, plainKey) {
            var bits = 1024;
            var mattsRSAkey = cryptico().generateRSAKey(passPhrase, bits);
            var mattsPublicKeyString = cryptico().publicKeyString(mattsRSAkey);
            var encryptionResult = cryptico().encrypt(plainKey, mattsPublicKeyString);
            return encryptionResult.cipher;
        };
        var decrypt = function (passPhrase, encryptedKey) {
            var bits = 1024;
            var mattsRSAkey = cryptico().generateRSAKey(passPhrase, bits);
            var decryptionResult = cryptico().decrypt(encryptedKey, mattsRSAkey);
            //if (decryptionResult.status == 'success' && decryptionResult.signature == 'verified') // why?
            if (decryptionResult.status == 'success') {
                // ok
            }
            else {
                return '';
            }
            return decryptionResult.plaintext;
        };
        // method
        return {
            encrypt: function (passPhrase, plainKey) {
                return encrypt(passPhrase, plainKey);
            },
            decrypt: function (passPhrase, encryptedKey) {
                return decrypt(passPhrase, encryptedKey);
            },
            consumerKey: function (licenseType) {
                var d = $q.defer();
                // get key from cache if exists
                if (consumerKeyCache[licenseType]) {
                    d.resolve(consumerKeyCache[licenseType]);
                    return d.promise;
                }
                // get encrypted consumer key
                var cmdOptions = {};
                var secretCmd = unpackedPath + "/vendor/secret";
                // passPhrase
                exec()(secretCmd + " -key=passPhrase", cmdOptions, function (err, stdout, stderr) {
                    if (err) {
                        d.reject(err);
                        return;
                    }
                    var devPassPhrase = stdout;
                    // licenseKey
                    exec()(secretCmd + " -key=" + licenseType, cmdOptions, function (err, stdout, stderr) {
                        if (err) {
                            d.reject(err);
                            return;
                        }
                        var encryptedKey = stdout;
                        var decrypted = decrypt(devPassPhrase, encryptedKey);
                        consumerKeyCache[licenseType] = decrypted; // set cache
                        d.resolve(decrypted);
                    });
                });
                return d.promise;
            }
        };
    }]);
