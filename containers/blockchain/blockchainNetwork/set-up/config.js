import {
  readFileSync
} from 'fs';
import {
  resolve
} from 'path';
const basePath = resolve(__dirname, '../certs');
const readCryptoFile = filename => readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'mychannel',
  channelConfig: readFileSync(resolve(__dirname, 'channel.tx')),
  chaincodeId: 'bcfit',
  chaincodeVersion: '1',
  chaincodePath: 'bcfit',
  orderer: {
    hostname: 'orderer0',
    url: 'grpcs://orderer0:7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  peers: [{
    peer: {
      hostname: 'shop-peer',
      url: 'grpcs://shop-peer:7051',
      eventHubUrl: 'grpcs://shop-peer:7053',
      pem: readCryptoFile('shopOrg.pem'),
      userKeystoreDBName: 'user_keystore_db',
      userKeystoreDBUrl: 'http://couchdb0:5984',
      stateDBName: 'member_state_db',
      stateDBUrl: 'http://couchdb0:5984',
      org: 'org.ShopOrg'
    },
    ca: {
      hostname: 'shop-ca',
      url: 'https://shop-ca:7054',
      mspId: 'ShopOrgMSP',
      caName: 'shop-org'
    },
    admin: {
      key: readCryptoFile('Admin@shop-org-key.pem'),
      cert: readCryptoFile('Admin@shop-org-cert.pem')
    }
  }, {
    peer: {
      hostname: 'fitcoin-peer',
      url: 'grpcs://fitcoin-peer:7051',
      pem: readCryptoFile('fitcoinOrg.pem'),
      userKeystoreDBName: 'user_keystore_db',
      userKeystoreDBUrl: 'http://couchdb1:5984',
      stateDBName: 'member_state_db',
      stateDBUrl: 'http://couchdb1:5984',
      eventHubUrl: 'grpcs://fitcoin-peer:7053',
      org: 'org.FitCoinOrg'
    },
    ca: {
      hostname: 'fitcoin-ca',
      url: 'https://fitcoin-ca:7054',
      mspId: 'FitCoinOrgMSP',
      caName: 'fitcoin-org'
    },
    admin: {
      key: readCryptoFile('Admin@fitcoin-org-key.pem'),
      cert: readCryptoFile('Admin@fitcoin-org-cert.pem')
    }
  }]
};
if(process.env.LOCALCONFIG) {
  config.orderer.url = 'grpcs://localhost:7050';
  config.peers[0].peer.url = 'grpcs://localhost:7051';
  config.peers[0].peer.eventHubUrl = 'grpcs://localhost:7053';
  config.peers[0].ca.url = 'https://localhost:7054';
  config.peers[0].peer.userKeystoreDBUrl = 'http://localhost:5984';
  config.peers[0].peer.stateDBUrl = 'http://localhost:5984';
  config.peers[1].peer.url = 'grpcs://localhost:8051';
  config.peers[1].peer.eventHubUrl = 'grpcs://localhost:8053';
  config.peers[1].ca.url = 'https://localhost:8054';
  config.peers[1].peer.userKeystoreDBUrl = 'http://localhost:6984';
  config.peers[1].peer.stateDBUrl = 'http://localhost:6984';
}
export default config;