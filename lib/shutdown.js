'use strict';

const async = require('async');

const shutdown = function (servers, callback) {
  if (!servers) {
    throw new Error('Servers are missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  async.each(servers, (server, done) => {
    server.close(done);
  }, callback);
};

module.exports = shutdown;
