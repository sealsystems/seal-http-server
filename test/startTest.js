'use strict';

const util = require('util');

const assert = require('assertthat');
const express = require('express');
const freeport = util.promisify(require('freeport'));
const proxyquire = require('proxyquire');

const externalIp = require('./externalIp');
const start = require('../lib/start');

let errCreate;

const startMock = proxyquire('../lib/start', {
  async './server/create' () {
    if (errCreate) {
      throw errCreate;
    }
  }
});

suite('start', () => {
  setup(() => {
    errCreate = null;
  });

  test('is a function.', async () => {
    assert.that(start).is.ofType('function');
  });

  test('throws an error if express app is missing.', async () => {
    await assert.that(async () => {
      await start({ host: 'foo', port: 1234 });
    }).is.throwingAsync('Express app is missing.');
  });

  test('throws an error if port is missing.', async () => {
    await assert.that(async () => {
      await start({ app: {}, host: 'foo' });
    }).is.throwingAsync('Port is missing.');
  });

  test('throws an error if creation of server failed.', async () => {
    const app = express();

    errCreate = new Error('foo');

    await assert.that(async () => {
      await startMock({ app, host: externalIp(), port: await freeport() });
    }).is.throwingAsync('foo');
  });

  test('starts servers for local and external connections by default.', async () => {
    const app = express();

    const interfaces = await start({ app, host: externalIp(), port: await freeport() });

    assert.that(interfaces.local).is.not.undefined();
    assert.that(interfaces.external).is.not.undefined();

    await Promise.all([
      new Promise((resolve) => interfaces.local.server.close(resolve)),
      new Promise((resolve) => interfaces.external.server.close(resolve))
    ]);
  });

  test('starts only one server if host is set to \'127.0.0.1\'', async () => {
    const app = express();

    const interfaces = await start({ app, host: '127.0.0.1', port: await freeport() });

    assert.that(interfaces.local).is.not.null();
    assert.that(interfaces.external).is.undefined();

    await new Promise((resolve) => {
      interfaces.local.server.close(resolve);
    });
  });

  test('starts only one server if host is set to \'localhost\'', async () => {
    const app = express();

    const interfaces = await start({ app, host: 'localhost', port: await freeport() });

    assert.that(interfaces.local).is.not.null();
    assert.that(interfaces.external).is.undefined();

    await new Promise((resolve) => {
      interfaces.local.server.close(resolve);
    });
  });
});
