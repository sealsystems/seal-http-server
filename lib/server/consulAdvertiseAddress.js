'use strict';

const consul = require('@sealsystems/seal-consul');
const getenv = require('getenv');

const consulAdvertiseAddress = function (callback) {
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  const consulUrl = getenv('CONSUL_URL', 'http://localhost:8500');

  consul.initialize({ consulUrl });

  consul.getDebugConfig((err, config) => {
    if (err) {
      return callback(err);
    }

    if (!config || !config.AdvertiseAddrLAN) {
      return callback(new Error('Invalid information from Consul received.'));
    }

    callback(null, config.AdvertiseAddrLAN);
  });
};

module.exports = consulAdvertiseAddress;
