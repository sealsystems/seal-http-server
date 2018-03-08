'use strict';

const assert = require('assertthat');

const shutdown = require('../lib/shutdown');

suite('shutdown', () => {
  test('is a function.', async () => {
    assert.that(shutdown).is.ofType('function');
  });

  test('throws an error if servers are missing.', async () => {
    await assert.that(async () => {
      await shutdown();
    }).is.throwingAsync('Servers are missing.');
  });

  test('handles empty server list correctly.', async () => {
    await assert.that(async () => {
      await shutdown({});
    }).is.not.throwingAsync();
  });

  test('calls the close function of each server.', async () => {
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

    await shutdown(servers);

    assert.that(closeCallCount).is.equalTo(2);
  });
});
