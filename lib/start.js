'use strict';

const log = require('seal-log').getLogger();

const create = require('./server/create');

const listen = function (networkInterfaces, name, callback) {
  const networkInterface = networkInterfaces[name];

  if (!networkInterface) {
    return callback(null);
  }

  log.info(`Starting ${name} http server.`, {
    host: networkInterface.host,
    port: networkInterface.port
  });
  networkInterface.server.setTimeout(0);
  networkInterface.server.listen(networkInterface.port, networkInterface.host, callback);
};

const start = function (options, callback) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.app) {
    throw new Error('Express app is missing.');
  }
  if (!options.port) {
    throw new Error('Port is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  create(options, (err, networkInterfaces) => {
    if (err) {
      return callback(err);
    }

    listen(networkInterfaces, 'external', () => {
      listen(networkInterfaces, 'local', () => {
        log.info('All http servers started.');

        callback(null, networkInterfaces);
      });
    });
  });
};

module.exports = start;
