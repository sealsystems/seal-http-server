'use strict';

const assert = require('assertthat');

const shutdown = require('../lib/shutdown');

suite('shutdown', () => {
  test('is a function.', (done) => {
    assert.that(shutdown).is.ofType('function');
    done();
  });

  test('throws an error if servers are missing.', (done) => {
    assert.that(() => {
      shutdown();
    }).is.throwing('Servers are missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      shutdown({});
    }).is.throwing('Callback is missing.');
    done();
  });

  test('handles empty server list correctly.', (done) => {
    shutdown({}, (err) => {
      assert.that(err).is.falsy();
      done();
    });
  });

  test('calls the close function of each server.', (done) => {
    let closeCallCount = 0;
    const servers = {
      local: {
        close (callback) {
          closeCallCount++;
          callback(null);
        }
      },
      external: {
        close (callback) {
          closeCallCount++;
          callback(null);
        }
      }
    };

    shutdown(servers, (err) => {
      assert.that(err).is.falsy();
      assert.that(closeCallCount).is.equalTo(2);
      done();
    });
  });
});
