'use strict';

const consul = require('@sealsystems/consul');
const processenv = require('processenv');

const consulAdvertiseAddress = async function () {
  const consulUrl = processenv('CONSUL_URL') || 'http://localhost:8500';

  await consul.initialize({ consulUrl });

  const configuration = await consul.getConfiguration();

  if (!configuration || !configuration.AdvertiseAddr) {
    throw new Error('Invalid information from Consul received.');
  }

  return configuration.AdvertiseAddr;
};

module.exports = consulAdvertiseAddress;
