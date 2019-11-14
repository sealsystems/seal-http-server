'use strict';

const assert = require('assertthat');

const consulAdvertiseAddress = require('../../lib/server/consulAdvertiseAddress');

let dataConsul, errConsul;

const consul = {
  // eslint-disable-next-line no-empty-function
  async initialize() {},
  async getConfiguration() {
    if (errConsul) {
      throw errConsul;
    }

    return dataConsul;
  },
  async getMember() {
    if (errConsul) {
      throw errConsul;
    }

    return dataConsul;
  }
};

suite('consulAdvertiseAddress', () => {
  setup(async () => {
    dataConsul = null;
    errConsul = null;
  });

  test('is a function', async () => {
    assert.that(consulAdvertiseAddress).is.ofType('function');
  });

  test('throws an error if Consul is missing.', async () => {
    await assert
      .that(async () => {
        await consulAdvertiseAddress();
      })
      .is.throwingAsync('Consul is missing.');
  });

  test('throws an error if Consul failed.', async () => {
    errConsul = new Error('foo');

    await assert
      .that(async () => {
        await consulAdvertiseAddress(consul);
      })
      .is.throwingAsync('foo');
  });

  test('throws an error if Consul does not provide a config.', async () => {
    dataConsul = null;

    await assert
      .that(async () => {
        await consulAdvertiseAddress(consul);
      })
      .is.throwingAsync('Invalid information from Consul received.');
  });

  test('throws an error if Consul does not provide a advertise address.', async () => {
    dataConsul = { foo: 'bar' };

    await assert
      .that(async () => {
        await consulAdvertiseAddress(consul);
      })
      .is.throwingAsync('Invalid information from Consul received.');
  });
});
