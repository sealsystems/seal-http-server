'use strict';

const assert = require('assertthat');
const { host } = require('docker-host')();
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

const consulAdvertiseAddress = require('../../lib/server/consulAdvertiseAddress');

let dataConsul,
    errConsul;

const consulAdvertiseAddressMock = proxyquire('../../lib/server/consulAdvertiseAddress', {
  '@sealsystems/consul': {
    async initialize () {},
    async getConfiguration () {
      if (errConsul) {
        throw errConsul;
      }

      return dataConsul;
    }
  }
});

suite('consulAdvertiseAddress', () => {
  setup(async () => {
    dataConsul = null;
    errConsul = null;
  });

  test('is a function', async () => {
    assert.that(consulAdvertiseAddress).is.ofType('function');
  });

  test('throws an error if Consul failed.', async () => {
    errConsul = new Error('foo');

    await assert.that(async () => {
      await consulAdvertiseAddressMock();
    }).is.throwingAsync('foo');
  });

  test('throws an error if Consul does not provide a config.', async () => {
    dataConsul = null;

    await assert.that(async () => {
      await consulAdvertiseAddressMock();
    }).is.throwingAsync('Invalid information from Consul received.');
  });

  test('throws an error if Consul does not provide a advertise address.', async () => {
    dataConsul = { foo: 'bar' };

    await assert.that(async () => {
      await consulAdvertiseAddressMock();
    }).is.throwingAsync('Invalid information from Consul received.');
  });

  test.skip('queries the advertised address from Consul.', async () => {
    const restore = nodeenv('CONSUL_URL', `http://${host}:8500`);
    const address = await consulAdvertiseAddress();

    assert.that(address).is.matching(/\d+\.\d+\.\d+\.\d+/);

    restore();
  });
});
