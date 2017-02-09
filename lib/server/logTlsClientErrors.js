'use strict';

const https = require('https');

const _ = require('lodash');

const log = require('seal-log').getLogger();

const logTlsClientErrors = function (networkInterfaces) {
  _.values(networkInterfaces).forEach((nic) => {
    if (nic.server instanceof https.Server) {
      nic.server.on('tlsClientError', (err) => {
        log.error('A client error occurred while establishing a secure connection.', { err });
      });
    }
  });
};

module.exports = logTlsClientErrors;
