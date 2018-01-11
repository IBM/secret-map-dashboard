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
  chaincodeVersion: 'v2',
  chaincodePath: 'bcfit',
  orderer: {
    hostname: 'orderer0',
    url: 'grpcs://orderer0:7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  peer: {
    hostname: 'shop-peer',
    url: 'grpcs://shop-peer:7051',
    eventHubUrl: 'grpcs://shop-peer:7053',
    pem: readCryptoFile('shopOrg.pem'),
    userKeystoreDBName: 'user_keystore_db',
    userKeystoreDBUrl: 'http://couchdb0:5984',
    stateDBName: 'member_state_db',
    stateDBUrl: 'http://couchdb0:5984',
    org: 'org.ShopOrg',
    caName: 'shop-org'
  },
  ca: {
    hostname: 'shop-ca',
    url: 'https://shop-ca:7054',
    mspId: 'ShopOrgMSP'
  },
  admin: {
    key: readCryptoFile('Admin@shop-org-key.pem'),
    cert: readCryptoFile('Admin@shop-org-cert.pem')
  }
};
if(process.env.LOCALCONFIG) {
  config.orderer0.url = 'grpcs://localhost:7050';
  config.shopOrg.peer.url = 'grpcs://localhost:7051';
  config.shopOrg.peer.eventHubUrl = 'grpcs://localhost:7053';
  config.shopOrg.ca.url = 'https://localhost:7054';
  config.shopOrg.peer.dburl = 'http://localhost:5984';
}
export default config;