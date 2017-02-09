'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

const tlscert = require('seal-tlscert');

const tlsOptions = require('../../lib/server/tlsOptions');

const tlsOptionsMockNoCA = proxyquire('../../lib/server/tlsOptions', {
  'seal-tlscert': {
    get () {
      return {};
    }
  }
});
const tlsOptionsMockWithCA = proxyquire('../../lib/server/tlsOptions', {
  'seal-tlscert': {
    get () {
      return { ca: 'foo' };
    }
  }
});

suite('tlsOptions', () => {
  test('is a function.', (done) => {
    assert.that(tlsOptions).is.ofType('function');
    done();
  });

  test('returns the keystore.', (done) => {
    const keystore = tlscert.get();
    const options = tlsOptions();

    assert.that(options.cert).is.equalTo(keystore.cert);
    assert.that(options.key).is.equalTo(keystore.key);
    assert.that(options.ca).is.equalTo(keystore.ca);
    done();
  });

  test('does not return tls ciphers by default.', (done) => {
    assert.that(tlsOptions().ciphers).is.equalTo('');
    done();
  });

  test('does not set CA related options by default.', (done) => {
    const actual = tlsOptionsMockNoCA();

    assert.that(actual.rejectUnauthorized).is.undefined();
    assert.that(actual.requestCert).is.undefined();
    done();
  });

  test('does set CA related options by default if CA is provided.', (done) => {
    const actual = tlsOptionsMockWithCA();

    assert.that(actual.rejectUnauthorized).is.true();
    assert.that(actual.requestCert).is.true();
    done();
  });
});
