'use strict';
import config from '../set-up/config';
import {
  OrganizationClient
} from '../set-up/client';
import queryFunc from '../set-up/query';
const shopClient = new OrganizationClient(config.channelName, config.orderer, config.shopOrg.peer, config.shopOrg.ca, config.shopOrg.admin);
const fitcoinClient = new OrganizationClient(config.channelName, config.orderer, config.fitcoinOrg.peer, config.fitcoinOrg.ca, config.fitcoinOrg.admin);
(async () => {
  try {
    await Promise.all([shopClient.login(), fitcoinClient.login()]);
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  };
  await Promise.all([shopClient.initEventHubs(), fitcoinClient.initEventHubs()]);
  queryFunc("admin", shopClient, config.chaincodeId, config.chaincodeVersion, "query", ["a"]);
  queryFunc("admin", shopClient, config.chaincodeId, config.chaincodeVersion, "query", ["b"]);
  queryFunc("admin", fitcoinClient, config.chaincodeId, config.chaincodeVersion, "query", ["a"]);
  queryFunc("admin", fitcoinClient, config.chaincodeId, config.chaincodeVersion, "query", ["b"]);
})();