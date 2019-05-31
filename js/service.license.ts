var _exec: any, exec         = () => { _exec = _exec || require('child_process').exec; return _exec; };
var _cryptico: any, cryptico = () => { _cryptico = _cryptico || require('cryptico.js'); return _cryptico; };
var _epath: any, epath       = () => { _epath = _epath || require('electron-path'); return _epath; };

var unpackedPath = epath().getUnpackedPath();

// angular license service
class LicenseService implements yubo.LicenseService {
  private readonly consumerKeyCache: {[index: string]: string} = {};
  constructor(
    private $q: ng.IQService
  ) {}

  encrypt(passPhrase: string, plainKey: string): string {
    const bits = 1024;
    const mattsRSAkey = cryptico().generateRSAKey(passPhrase, bits);
    const mattsPublicKeyString = cryptico().publicKeyString(mattsRSAkey);

    const encryptionResult = cryptico().encrypt(plainKey, mattsPublicKeyString);
    return encryptionResult.cipher;
  }

  decrypt(passPhrase: string, encryptedKey: string): string {
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
  }

  consumerKey(licenseType: string): ng.IPromise<string> {
    const d = this.$q.defer<string>();

    // get key from cache if exists
    if (this.consumerKeyCache[licenseType]) {
      d.resolve(this.consumerKeyCache[licenseType]); return d.promise;
    }

    // get encrypted consumer key
    const cmdOptions = {};
    const secretCmd = `${unpackedPath}/vendor/secret`;
    // passPhrase
    exec()(`${secretCmd} -key=passPhrase`, cmdOptions, (err: Error, stdout: string, stderr: string) => {
      if (err) {
        d.reject(err); return;
      }
      const devPassPhrase = stdout;
    // licenseKey
    exec()(`${secretCmd} -key=${licenseType}`, cmdOptions, (err: Error, stdout: string, stderr: string) => {
      if (err) {
        d.reject(err); return;
      }
      const encryptedKey = stdout;

      const decrypted = this.decrypt(devPassPhrase, encryptedKey);
      this.consumerKeyCache[licenseType] = decrypted; // set cache
      d.resolve(decrypted);
    });
    });
    return d.promise;
  }
}

angular.module('LicenseServices', [])
  .service('LicenseService', [
    '$q',
    LicenseService,
  ]);
