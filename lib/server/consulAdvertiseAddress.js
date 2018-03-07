'use strict';

const consul = require('@sealsystems/consul');
const processenv = require('processenv');

const consulAdvertiseAddress = async function () {
  const consulUrl = processenv('CONSUL_URL') || 'http://localhost:8500';

  await consul.initialize({ consulUrl });

  const memberInfo = await consul.getMember();

  if (!memberInfo || !memberInfo.Addr) {
    throw new Error('Invalid information from Consul received.');
  }

  return memberInfo.Addr;
};

module.exports = consulAdvertiseAddress;
