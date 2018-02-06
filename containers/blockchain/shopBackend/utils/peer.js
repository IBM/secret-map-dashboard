import {
  OrganizationClient
} from '../set-up/client';
import config from '../set-up/config';
const orgId = process.env.ORGID || "org.ShopOrg";
const numberOfClients = process.env.WORKERCLIENTS || 1;
const workerClients = config.peers.filter(obj => obj.peer.org === orgId).map(obj => Array(numberOfClients).fill(obj)).reduce((acc, val) => acc.concat(val), []).map(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));
const eventEmitterClient = new OrganizationClient(workerClients[0]._channelName, workerClients[0]._ordererConfig, workerClients[0]._peerConfig, workerClients[0]._caConfig, workerClients[0]._admin);
const clientArray = {
  workers: workerClients,
  eventEmitter: eventEmitterClient
};
export async function initiateClient() {
  try {
    for(var i = 0; i < workerClients.length; i++) {
      await workerClients[i].login();
    }
    await eventEmitterClient.login();
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  await Promise.all([workerClients.map(obj => obj.initEventHubs()), eventEmitterClient.initEventHubs()]);
}
exports.clients = clientArray;