'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

const servers = {
  external: 'foo',
  local: 'bar'
};
let errShutdown,
    errStart;

const httpServer = proxyquire('../lib/httpServer', {
  './shutdown' (runningServers, callback) {
    assert.that(runningServers).is.equalTo(servers);
    callback(errShutdown);
  },
  './start' (options, callback) {
    callback(errStart, servers);
  }
});

suite('httpServer', () => {
  setup(() => {
    errShutdown = null;
    errStart = null;
  });

  test('is an object.', (done) => {
    assert.that(httpServer).is.ofType('object');
    done();
  });

  suite('start', () => {
    test('is a function.', (done) => {
      assert.that(httpServer.start).is.ofType('function');
      done();
    });

    test('throws an error if options are misssing.', (done) => {
      assert.that(() => {
        httpServer.start();
      }).is.throwing('Options are missing.');
      done();
    });

    test('throws an error if callback is misssing.', (done) => {
      assert.that(() => {
        httpServer.start({});
      }).is.throwing('Callback is missing.');
      done();
    });

    test('calls the callback.', (done) => {
      httpServer.start({}, (err) => {
        assert.that(err).is.falsy();
        done();
      });
    });

    test('returns an error if starting the servers failed.', (done) => {
      errStart = new Error('foo');
      httpServer.start({}, (err) => {
        assert.that(err).is.not.falsy();
        assert.that(err.message).is.equalTo('foo');
        done();
      });
    });
  });

  suite('shutdown', () => {
    test('is a function.', (done) => {
      assert.that(httpServer.shutdown).is.ofType('function');
      done();
    });

    test('throws an error if callback is misssing.', (done) => {
      assert.that(() => {
        httpServer.shutdown();
      }).is.throwing('Callback is missing.');
      done();
    });

    test('calls the callback.', (done) => {
      httpServer.shutdown((err) => {
        assert.that(err).is.falsy();
        done();
      });
    });

    test('returns an error if shutting down the servers failed.', (done) => {
      errShutdown = new Error('foo');
      httpServer.shutdown((err) => {
        assert.that(err).is.not.falsy();
        assert.that(err.message).is.equalTo('foo');
        done();
      });
    });
  });
});
