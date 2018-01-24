import {
  OrganizationClient
} from '../set-up/client';
import config from '../set-up/config';
const orgId = process.env.ORGID || "org.ShopOrg";
const clientArray = config.peers.filter(obj => obj.peer.org === orgId).map(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));
export async function initiateClient() {
  try {
    await Promise.all(clientArray.map(obj => obj.login()));
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  };
  await Promise.all(clientArray.map(obj => obj.initEventHubs()));
}
exports.clients = clientArray;