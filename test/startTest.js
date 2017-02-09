'use strict';

const assert = require('assertthat');
const express = require('express');
const proxyquire = require('proxyquire');

const externalIp = require('./externalIp');
const start = require('../lib/start');

let errCreate;
const startMock = proxyquire('../lib/start', {
  './server/create' (options, callback) {
    callback(errCreate);
  }
});

suite('start', () => {
  setup((done) => {
    errCreate = null;
    done();
  });

  test('is a function.', (done) => {
    assert.that(start).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', (done) => {
    assert.that(() => {
      start();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if express app is missing.', (done) => {
    assert.that(() => {
      start({ host: 'foo', port: 1234 });
    }).is.throwing('Express app is missing.');
    done();
  });

  test('throws an error if port is missing.', (done) => {
    assert.that(() => {
      start({ app: {}, host: 'foo' });
    }).is.throwing('Port is missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      start({ app: {}, host: 'foo', port: 1234 });
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns an error if creation of server failed.', (done) => {
    const app = express();

    errCreate = new Error('foo');
    startMock({
      app,
      host: externalIp(),
      port: 3000
    }, (err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('starts servers for local and external connections by default.', (done) => {
    const app = express();

    start({
      app,
      host: externalIp(),
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.external).is.not.null();
      interfaces.local.server.close(() => {
        interfaces.external.server.close(() => {
          done();
        });
      });
    });
  });

  test('starts only one server if host is set to \'127.0.0.1\'', (done) => {
    const app = express();

    start({
      app,
      host: '127.0.0.1',
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.external).is.undefined();
      interfaces.local.server.close(() => {
        done();
      });
    });
  });

  test('starts only one server if host is set to \'localhost\'', (done) => {
    const app = express();

    start({
      app,
      host: 'localhost',
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.external).is.undefined();
      interfaces.local.server.close(() => {
        done();
      });
    });
  });
});
