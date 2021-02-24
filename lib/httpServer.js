'use strict';

const startServer = require('./start');
const shutdownServer = require('./shutdown');

let instances;

const httpServer = {
  async start(options) {
    if (!options) {
      throw new Error('Options are missing.');
    }

    instances = await startServer(options);
    const serverList = [];
    if (instances.external) {
      serverList.push(instances.external.server);
    }
    if (instances.local) {
      serverList.push(instances.local.server);
    }
    return serverList;
  },

  async shutdown() {
    await shutdownServer(instances);
  }
};

module.exports = httpServer;
