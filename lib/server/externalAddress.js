'use strict';

const consulAdvertiseAddress = require('./consulAdvertiseAddress');

const externalAddress = function (host, callback) {
  if (!host) {
    return consulAdvertiseAddress(callback);
  }

  process.nextTick(() => {
    callback(null, host);
  });
};

module.exports = externalAddress;
