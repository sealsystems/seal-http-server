'use strict';

const consul = require('@sealsystems/consul');
const getenv = require('getenv');

const consulAdvertiseAddress = async function () {
  const consulUrl = getenv('CONSUL_URL', 'http://localhost:8500');

  await consul.initialize({ consulUrl });

  const memberInfo = await consul.getMember();

  if (!memberInfo || !memberInfo.Addr) {
    throw new Error('Invalid information from Consul received.');
  }

  return memberInfo.Addr;
};

module.exports = consulAdvertiseAddress;
