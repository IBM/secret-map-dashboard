import {
  OrganizationClient
} from '../set-up/client';
import config from '../set-up/config';
const orgId = process.env.ORGID || "org.FitCoinOrg";
//const clientArray = config.peers.filter(obj => obj.peer.org === orgId).map(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));
//const numberOfClients = process.env.WORKERCLIENTS || 1;
const workerClients = config.peers.filter(obj => obj.peer.org === orgId).map(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));
export async function initiateClient() {
  try {
    for(var i = 0; i < workerClients.length; i++) {
      await workerClients[i].login();
    }
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  await Promise.all(workerClients.map(obj => obj.initEventHubs()));
}
exports.clients = workerClients;