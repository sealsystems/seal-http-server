'use strict';

const http = require('http');
const https = require('https');

const assert = require('assertthat');
const express = require('express');
const externalIp = require('../externalIp');
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

let errExternalAddress;
const create = proxyquire('../../lib/server/create', {
  './externalAddress' (host, callback) {
    if (host) {
      return callback(errExternalAddress, host);
    }

    callback(errExternalAddress, externalIp());
  }
});

suite('create', () => {
  setup((done) => {
    errExternalAddress = null;
    done();
  });

  test('is a function.', (done) => {
    assert.that(create).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', (done) => {
    assert.that(() => {
      create();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if express app is missing.', (done) => {
    assert.that(() => {
      create({ host: 'foo' });
    }).is.throwing('Express app is missing.');
    done();
  });

  test('returns an error if TLS_UNPROTECTED is invalid.', (done) => {
    const app = express();
    const restore = nodeenv('TLS_UNPROTECTED', 'foo');

    create({
      app,
      port: 3000
    }, (err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('TLS_UNPROTECTED invalid.');
      restore();
      done();
    });
  });

  test('returns an error if getting the external address failed.', (done) => {
    const app = express();

    errExternalAddress = new Error('foo');
    create({
      app,
      port: 3000
    }, (err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  test('creates only http servers if TLS_UNPROTECTED=world.', (done) => {
    const app = express();
    const restore = nodeenv('TLS_UNPROTECTED', 'world');

    create({
      app,
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.local.server).is.instanceOf(http.Server);
      assert.that(interfaces.external).is.not.null();
      assert.that(interfaces.external.server).is.instanceOf(http.Server);
      interfaces.local.server.close(() => {
        interfaces.external.server.close(() => {
          restore();
          done();
        });
      });
    });
  });

  test('creates https and http servers if TLS_UNPROTECTED=loopback.', (done) => {
    const app = express();
    const restore = nodeenv('TLS_UNPROTECTED', 'loopback');

    create({
      app,
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.local.server).is.instanceOf(http.Server);
      assert.that(interfaces.external).is.not.null();
      assert.that(interfaces.external.server).is.instanceOf(https.Server);
      interfaces.local.server.close(() => {
        interfaces.external.server.close(() => {
          restore();
          done();
        });
      });
    });
  });

  test('creates only https servers if TLS_UNPROTECTED=none.', (done) => {
    const app = express();
    const restore = nodeenv('TLS_UNPROTECTED', 'none');

    create({
      app,
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.local.server).is.instanceOf(https.Server);
      assert.that(interfaces.external).is.not.null();
      assert.that(interfaces.external.server).is.instanceOf(https.Server);
      interfaces.local.server.close(() => {
        interfaces.external.server.close(() => {
          restore();
          done();
        });
      });
    });
  });

  test('creates only one server if host is set to \'127.0.0.1\'', (done) => {
    const app = express();

    create({
      app,
      host: '127.0.0.1',
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.local.server).is.not.null();
      assert.that(interfaces.external).is.undefined();
      interfaces.local.server.close(() => {
        done();
      });
    });
  });

  test('creates only one server if host is set to \'localhost\'', (done) => {
    const app = express();

    create({
      app,
      host: 'localhost',
      port: 3000
    }, (err, interfaces) => {
      assert.that(err).is.null();
      assert.that(interfaces.local).is.not.null();
      assert.that(interfaces.local.server).is.not.null();
      assert.that(interfaces.external).is.undefined();
      interfaces.local.server.close(() => {
        done();
      });
    });
  });
});
