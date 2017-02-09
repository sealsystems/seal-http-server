'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

const externalAddress = proxyquire('../../lib/server/externalAddress', {
  './consulAdvertiseAddress' (callback) {
    callback(null, 'bar');
  }
});

suite('externalAddress', () => {
  test('is a function.', (done) => {
    assert.that(externalAddress).is.ofType('function');
    done();
  });

  test('returns the given host.', (done) => {
    externalAddress('foo', (err, address) => {
      assert.that(err).is.null();
      assert.that(address).is.equalTo('foo');
      done();
    });
  });

  test('returns the address advertised by Consul if no host is given.', (done) => {
    externalAddress('', (err, address) => {
      assert.that(err).is.null();
      assert.that(address).is.equalTo('bar');
      done();
    });
  });
});
