import {exec} from 'child_process';
import * as cryptico from 'cryptico.js';
import {remote} from 'electron';
import * as angular from 'angular';

var app = remote.app;
var appPath = app.getAppPath();
var unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');

// angular license service
angular.module('yvoiceLicenseService', [])
  .factory('LicenseService', ['$q', ($q) => {
    var consumerKeyCache = {};

    // encrypt decrypt
    var encrypt = function(passPhrase, plainKey): string {
      var bits = 1024;
      var mattsRSAkey = cryptico.generateRSAKey(passPhrase, bits);
      var mattsPublicKeyString = cryptico.publicKeyString(mattsRSAkey);

      var encryptionResult = cryptico.encrypt(plainKey, mattsPublicKeyString);
      return encryptionResult.cipher;
    };
    var decrypt = function(passPhrase, encryptedKey): string {
      var bits = 1024;
      var mattsRSAkey = cryptico.generateRSAKey(passPhrase, bits);

      var decryptionResult = cryptico.decrypt(encryptedKey, mattsRSAkey);
      //if (decryptionResult.status == 'success' && decryptionResult.signature == 'verified') // why?
      if (decryptionResult.status == 'success') {
        // ok
      } else {
        return '';
      }
      return decryptionResult.plaintext;
    };

    // method
    return {
      encrypt: function(passPhrase, plainKey): string {
        return encrypt(passPhrase, plainKey);
      },
      decrypt: function(passPhrase, encryptedKey): string {
        return decrypt(passPhrase, encryptedKey);
      },
      consumerKey: function(licenseType): ng.IPromise<string> {
        var d = $q.defer();

        // get key from cache if exists
        if (consumerKeyCache[licenseType]) {
          d.resolve(consumerKeyCache[licenseType]);
          return d.promise;
        }

        // get encrypted consumer key
        var cmdOptions = {};
        var secretCmd = unpackedPath + '/vendor/secret';
        // passPhrase
        exec(secretCmd + ' -key=passPhrase', cmdOptions, (err, stdout, stderr) => {
          if (err) {
            d.reject(err); return;
          }
          var devPassPhrase = stdout;
        // licenseKey
        exec(secretCmd + ' -key='+licenseType, cmdOptions, (err, stdout, stderr) => {
          if (err) {
            d.reject(err); return;
          }
          var encryptedKey = stdout;

          var decrypted = decrypt(devPassPhrase, encryptedKey);
          d.resolve(decrypted);
        });
        });
        return d.promise;
      }
    };
  }]);

