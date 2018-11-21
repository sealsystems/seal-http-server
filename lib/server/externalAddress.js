'use strict';

const consulAdvertiseAddress = require('./consulAdvertiseAddress');

const externalAddress = async function (host) {
  if (!host) {
    return await consulAdvertiseAddress();
  }

  return host;
};

module.exports = externalAddress;
