'use strict';

const assert = require('assertthat');
const host = require('docker-host')().host;
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

const consulAdvertiseAddress = require('../../lib/server/consulAdvertiseAddress');

let dataConsul,
    errConsul;
const consulAdvertiseAddressMock = proxyquire('../../lib/server/consulAdvertiseAddress', {
  '@sealsystems/seal-consul': {
    initialize () {},
    getConfig (callback) {
      callback(errConsul, dataConsul);
    }
  }
});

suite('consulAdvertiseAddress', () => {
  setup((done) => {
    dataConsul = null;
    errConsul = null;
    done();
  });

  test('is a function', (done) => {
    assert.that(consulAdvertiseAddress).is.ofType('function');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      consulAdvertiseAddress();
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns an error if Consul failed.', (done) => {
    errConsul = new Error('foo');
    consulAdvertiseAddressMock((err) => {
      assert.that(err).is.equalTo(errConsul);
      done();
    });
  });

  test('returns an error if Consul does not provide a config.', (done) => {
    dataConsul = null;
    consulAdvertiseAddressMock((err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('Invalid information from Consul received.');
      done();
    });
  });

  test('returns an error if Consul does not provide a advertise address.', (done) => {
    dataConsul = { foo: 'bar' };
    consulAdvertiseAddressMock((err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('Invalid information from Consul received.');
      done();
    });
  });

  test('queries the advertised address from Consul.', (done) => {
    nodeenv('CONSUL_URL', `http://${host}:8500`, (restore) => {
      consulAdvertiseAddress((err, address) => {
        assert.that(err).is.falsy();
        assert.that(address).is.matching(/\d+\.\d+\.\d+\.\d+/);
        restore();
        done();
      });
    });
  });
});
