'use strict';

const os = require('os');

const _ = require('lodash');

const externalIp = function () {
  const nics = os.networkInterfaces();

  return _.flatten(_.values(nics)).find((address) => {
    return (address.family === 'IPv4' && address.internal === false);
  }).address;
};

module.exports = externalIp;
