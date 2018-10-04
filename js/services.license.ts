var _exec, exec         = () => { _exec = _exec || require('child_process').exec; return _exec; };
var _cryptico, cryptico = () => { _cryptico = _cryptico || require('cryptico.js'); return _cryptico; };

var app = require('electron').remote.app;
var appPath = app.getAppPath();
var unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');

// angular license service
angular.module('yvoiceLicenseService', [])
  .factory('LicenseService', ['$q', ($q): yubo.LicenseService => {
    const consumerKeyCache = {};

    // encrypt decrypt
    const encrypt = function(passPhrase: string, plainKey: string): string {
      const bits = 1024;
      const mattsRSAkey = cryptico().generateRSAKey(passPhrase, bits);
      const mattsPublicKeyString = cryptico().publicKeyString(mattsRSAkey);

      const encryptionResult = cryptico().encrypt(plainKey, mattsPublicKeyString);
      return encryptionResult.cipher;
    };
    const decrypt = function(passPhrase: string, encryptedKey: string): string {
      const bits = 1024;
      const mattsRSAkey = cryptico().generateRSAKey(passPhrase, bits);

      const decryptionResult = cryptico().decrypt(encryptedKey, mattsRSAkey);
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
      encrypt: function(passPhrase: string, plainKey: string): string {
        return encrypt(passPhrase, plainKey);
      },
      decrypt: function(passPhrase: string, encryptedKey: string): string {
        return decrypt(passPhrase, encryptedKey);
      },
      consumerKey: function(licenseType: string): ng.IPromise<string> {
        const d = $q.defer();

        // get key from cache if exists
        if (consumerKeyCache[licenseType]) {
          d.resolve(consumerKeyCache[licenseType]);
          return d.promise;
        }

        // get encrypted consumer key
        const cmdOptions = {};
        const secretCmd = `${unpackedPath}/vendor/secret`;
        // passPhrase
        exec()(`${secretCmd} -key=passPhrase`, cmdOptions, (err: Error, stdout, stderr) => {
          if (err) {
            d.reject(err); return;
          }
          const devPassPhrase = stdout;
        // licenseKey
        exec()(`${secretCmd} -key=${licenseType}`, cmdOptions, (err: Error, stdout, stderr) => {
          if (err) {
            d.reject(err); return;
          }
          const encryptedKey = stdout;

          const decrypted = decrypt(devPassPhrase, encryptedKey);
          d.resolve(decrypted);
        });
        });
        return d.promise;
      },
    };
  }]);

