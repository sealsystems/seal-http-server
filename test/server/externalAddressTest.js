'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

const externalAddress = proxyquire('../../lib/server/externalAddress', {
  async './consulAdvertiseAddress'() {
    return 'bar';
  }
});

suite('externalAddress', () => {
  test('is a function.', async () => {
    assert.that(externalAddress).is.ofType('function');
  });

  test('throws an error if Consul is missing.', async () => {
    await assert
      .that(async () => {
        await externalAddress();
      })
      .is.throwingAsync('Consul is missing.');
  });

  test('returns the given host.', async () => {
    const address = await externalAddress({}, 'foo');

    assert.that(address).is.equalTo('foo');
  });

  test('returns the address advertised by Consul if no host is given.', async () => {
    const address = await externalAddress({}, '');

    assert.that(address).is.equalTo('bar');
  });
});
