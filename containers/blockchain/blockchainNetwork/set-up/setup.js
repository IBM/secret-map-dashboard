'use strict';
import config from './config';
import {
  OrganizationClient
} from './utils';
import http from 'http';
import url from 'url';
let status = 'down';
let statusChangedCallbacks = [];
// Setup clients per organization
//const shopClient = new OrganizationClient(config.channelName, config.orderer0, config.shopOrg.peer, config.shopOrg.ca, config.shopOrg.admin);
//const fitcoinClient = new OrganizationClient(config.channelName, config.orderer0, config.fitcoinOrg.peer, config.fitcoinOrg.ca, config.fitcoinOrg.admin);
const clientPeer = new OrganizationClient(config.channelName, config.orderer, config.peer, config.ca, config.admin);

function setStatus(s) {
  status = s;
  setTimeout(() => {
    statusChangedCallbacks.filter(f => typeof f === 'function').forEach(f => f(s));
  }, 1000);
}
export function subscribeStatus(cb) {
  if(typeof cb === 'function') {
    statusChangedCallbacks.push(cb);
  }
}
export function getStatus() {
  return status;
}
export function isReady() {
  return status === 'ready';
}

function getAdminOrgs() {
  return Promise.resolve(clientPeer.getOrgAdmin());
}
(async () => {
  // Login
  try {
    await Promise.resolve(clientPeer.login());
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Setup event hubs
  clientPeer.initEventHubs();
  try {
    await getAdminOrgs();
    //console.log("process.env.CREATE_CHANNEL  value :  " + process.env.CREATE_CHANNEL);
    if(!(await clientPeer.checkChannelMembership()) && process.env.CREATE_CHANNEL === "true") {
      console.log('Default channel not found, attempting creation...');
      const createChannelResponse = await clientPeer.createChannel(config.channelConfig);
      if(createChannelResponse.status === 'SUCCESS') {
        console.log('Successfully created a new default channel.');
        console.log('Joining peers to the default channel.');
        await Promise.resolve(clientPeer.joinChannel());
        // Wait for 10s for the peers to join the newly created channel
        await new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      }
    } else {
      console.log('Sleeping peer for 90 seconds.');
      await new Promise(resolve => {
        setTimeout(resolve, 90000);
      });
      console.log('Joining peers to the default channel.');
      await Promise.resolve(clientPeer.joinChannel());
      // Wait for 10s for the peers to join the newly created channel
      await new Promise(resolve => {
        setTimeout(resolve, 10000);
      });
      console.log('Peer connected to the default channel.');
    }
  } catch(e) {
    console.log('Fatal error bootstrapping the blockchain network!');
    console.log(e);
    process.exit(-1);
  }
  // Initialize network
  try {
    await Promise.resolve(clientPeer.initialize());
  } catch(e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Install chaincode on all peers
  let installedOnPeer;
  try {
    await getAdminOrgs();
    installedOnPeer = await clientPeer.checkInstalled(config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
  } catch(e) {
    console.log('Fatal error getting installation status of the chaincode!');
    console.log(e);
    process.exit(-1);
  }
  if(!(installedOnPeer)) {
    console.log('Chaincode is not installed, attempting installation...');
    // Pull chaincode environment base image
    try {
      await getAdminOrgs();
      const socketPath = process.env.DOCKER_SOCKET_PATH || (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
      const ccenvImage = process.env.DOCKER_CCENV_IMAGE || 'hyperledger/fabric-ccenv:x86_64-1.0.2';
      const listOpts = {
        socketPath,
        method: 'GET',
        path: '/images/json'
      };
      const pullOpts = {
        socketPath,
        method: 'POST',
        path: url.format({
          pathname: '/images/create',
          query: {
            fromImage: ccenvImage
          }
        })
      };
      const images = await new Promise((resolve, reject) => {
        const req = http.request(listOpts, (response) => {
          let data = '';
          response.setEncoding('utf-8');
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(JSON.parse(data));
          });
        });
        req.on('error', reject);
        req.end();
      });
      const imageExists = images.some(i => i.RepoTags && i.RepoTags.some(tag => tag === ccenvImage));
      if(!imageExists) {
        console.log('Base container image not present, pulling from Docker Hub...');
        await new Promise((resolve, reject) => {
          const req = http.request(pullOpts, (response) => {
            response.on('data', () => {});
            response.on('end', () => {
              resolve();
            });
          });
          req.on('error', reject);
          req.end();
        });
        console.log('Base container image downloaded.');
      } else {
        console.log('Base container image present.');
      }
    } catch(e) {
      console.log('Fatal error pulling docker images.');
      console.log(e);
      process.exit(-1);
    }
    // Install chaincode
    try {
      await Promise.resolve(clientPeer.install(config.chaincodeId, config.chaincodeVersion, config.chaincodePath));
      await new Promise(resolve => {
        setTimeout(resolve, 10000);
      });
      console.log('Successfully installed chaincode on the Peer.');
    } catch(e) {
      console.log('Fatal error installing chaincode on the Peer!');
      console.log(e);
      process.exit(-1);
    }
  } else {
    console.log('Chaincode already installed on the blockchain network.');
    setStatus('ready');
  }
  // Instantiate chaincode on all peers
  // Instantiating the chaincode on a single peer should be enough (for now)
  try {
    if(process.env.CREATE_CHANNEL === "true") {
      await clientPeer.instantiate(config.chaincodeId, config.chaincodeVersion, config.chaincodePath, '{"Args":[""]}');
      console.log('Successfully instantiated chaincode on channel.');
    } else {
      console.log('Chaincode is already instantiated on channel.');
    }
    setStatus('ready');
  } catch(e) {
    console.log('Fatal error instantiating chaincode on some(all) peers!');
    console.log(e);
    process.exit(-1);
  }
})();
// Export organization clients
export {
  clientPeer
};