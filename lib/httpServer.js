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
  },

  async shutdown() {
    await shutdownServer(instances);
  }
};

module.exports = httpServer;
