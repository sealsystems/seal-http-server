'use strict';

const getenv = require('getenv');
const tlscert = require('seal-tlscert');

const log = require('seal-log').getLogger();

let options;

const createTlsOptions = function () {
  const ciphers = getenv('TLS_CIPHERS', '');

  if (ciphers) {
    log.info('Explicitly set encryption ciphers.', { ciphers });
  }

  options = tlscert.get();
  options.ciphers = ciphers;
  if (options.ca) {
    options.rejectUnauthorized = true;
    options.requestCert = true;
  }

  return options;
};

const tlsOptions = function () {
  return options || createTlsOptions();
};

module.exports = tlsOptions;
