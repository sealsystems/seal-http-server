'use strict';

const http = require('http');
const https = require('https');

const getenv = require('getenv');

const log = require('seal-log').getLogger();

const externalAddress = require('./externalAddress');
const logTlsClientErrors = require('./logTlsClientErrors');
const tlsOptions = require('./tlsOptions');

const create = function (options, callback) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.app) {
    throw new Error('Express app is missing.');
  }

  const tlsUnprotected = getenv('TLS_UNPROTECTED', 'loopback');
  const serviceDiscovery = getenv('SERVICE_DISCOVERY', 'consul');

  const listenToAllInterfaces = (tlsUnprotected === 'world' && serviceDiscovery !== 'consul');

  if (listenToAllInterfaces) {
    options.host = '0.0.0.0';
  }

  externalAddress(options.host, (err, address) => {
    if (err) {
      return callback(err);
    }

    const isLocalOnly = (address === 'localhost' || address === '127.0.0.1');
    const networkInterfaces = {
      external: {
        host: address,
        port: options.port
      },
      local: {
        host: 'localhost',
        port: options.port
      }
    };

    switch (tlsUnprotected) {
      case 'none':
        log.info('All connections are encrypted via HTTPS.', { tlsUnprotected });
        networkInterfaces.external.server = https.createServer(tlsOptions(), options.app);
        networkInterfaces.local.server = https.createServer(tlsOptions(), options.app);
        break;

      case 'loopback':
        log.info('HTTP and HTTPS is used. Local connections are not encrypted!', { tlsUnprotected });
        networkInterfaces.external.server = https.createServer(tlsOptions(), options.app);
        networkInterfaces.local.server = http.createServer(options.app);
        break;

      case 'world':
        log.warn('Only HTTP is used. No connection is encrypted!', { tlsUnprotected });
        networkInterfaces.external.server = http.createServer(options.app);
        networkInterfaces.local.server = http.createServer(options.app);
        break;

      default:
        return callback(new Error('TLS_UNPROTECTED invalid.'));
    }

    if (listenToAllInterfaces) {
      log.info('Listen to all network interfaces. Do not start extra local http server.');
      delete networkInterfaces.local;
    }

    if (isLocalOnly) {
      log.info('Only local connections are allowed. Do not start external http server.');
      delete networkInterfaces.external;
    }

    logTlsClientErrors(networkInterfaces);

    callback(null, networkInterfaces);
  });
};

module.exports = create;
