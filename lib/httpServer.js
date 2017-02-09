'use strict';

const startServer = require('./start');
const shutdownServer = require('./shutdown');

let instances;

const httpServer = {
  start (options, callback) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (!callback) {
      throw new Error('Callback is missing.');
    }

    startServer(options, (err, servers) => {
      instances = servers;
      callback(err);
    });
  },
  shutdown (callback) {
    if (!callback) {
      throw new Error('Callback is missing.');
    }

    shutdownServer(instances, callback);
  }
};

module.exports = httpServer;
