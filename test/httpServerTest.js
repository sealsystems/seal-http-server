'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

const servers = {
  external: 'foo',
  local: 'bar'
};

let errShutdown, errStart;

const httpServer = proxyquire('../lib/httpServer', {
  async './shutdown'(runningServers) {
    assert.that(runningServers).is.equalTo(servers);

    if (errShutdown) {
      throw errShutdown;
    }
  },
  async './start'() {
    if (errStart) {
      throw errStart;
    }

    return servers;
  }
});

suite('httpServer', () => {
  setup(async () => {
    errShutdown = null;
    errStart = null;
  });

  test('is an object.', async () => {
    assert.that(httpServer).is.ofType('object');
  });

  suite('start', () => {
    test('is a function.', async () => {
      assert.that(httpServer.start).is.ofType('function');
    });

    test('throws an error if options are misssing.', async () => {
      await assert
        .that(async () => {
          await httpServer.start();
        })
        .is.throwingAsync('Options are missing.');
    });

    test('does not throw an error.', async () => {
      await assert
        .that(async () => {
          await httpServer.start({});
        })
        .is.not.throwingAsync();
    });

    test('throws an error if starting the servers failed.', async () => {
      errStart = new Error('foo');

      await assert
        .that(async () => {
          await httpServer.start({});
        })
        .is.throwingAsync('foo');
    });
  });

  suite('shutdown', () => {
    test('is a function.', async () => {
      assert.that(httpServer.shutdown).is.ofType('function');
    });

    test('does not throw an error.', async () => {
      await assert
        .that(async () => {
          await httpServer.shutdown({});
        })
        .is.not.throwingAsync();
    });

    test('returns an error if shutting down the servers failed.', async () => {
      errShutdown = new Error('foo');

      await assert
        .that(async () => {
          await httpServer.shutdown({});
        })
        .is.throwingAsync('foo');
    });
  });
});
