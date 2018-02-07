'use strict';
const TRANSACTION_TIMEOUT = 120000;
export default async function (userId, clientObject, chaincodeId, chaincodeVersion, fcn, args) {
  var Transaction = require('fabric-client/lib/TransactionID.js');
  var user_from_store = await clientObject._client.getUserContext(userId, true);
  if(!(user_from_store && user_from_store.isEnrolled())) {
    throw new Error('Failed to get user : ' + userId + ' from persistence');
  }
  //console.log('Successfully loaded user : ' + userId + ' from persistence');
  let proposalResponses, proposal;
  const txId = new Transaction(user_from_store);
  try {
    const request = {
      chaincodeId: chaincodeId,
      chaincodeVersion: chaincodeVersion,
      fcn: fcn,
      args: args,
      chainId: clientObject._channelName,
      txId: txId
    };
    const results = await clientObject._channel.sendTransactionProposal(request);
    proposalResponses = results[0];
    proposal = results[1];
    const allGood = proposalResponses.every(pr => pr.response && pr.response.status == 200);
    if(!allGood) {
      throw new Error(`Proposal rejected by some (all) of the peers: ${proposalResponses}`);
    }
  } catch(e) {
    throw e;
  }
  try {
    const request = {
      proposalResponses,
      proposal
    };
    var transaction_id_string = txId.getTransactionID(); //Get the transaction ID string to be used by the event processing
    var promises = [];
    var sendPromise = clientObject._channel.sendTransaction(request);
    promises.push(sendPromise);
    let event_hub = clientObject._eventHubs[0];
    let txPromise = new Promise((resolve, reject) => {
      let handle = setTimeout(() => {
        event_hub.disconnect();
        resolve({
          event_status: 'TIMEOUT'
        });
      }, TRANSACTION_TIMEOUT);
      event_hub.connect();
      event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
        // this is the callback for transaction event status
        // first some clean up of event listener
        clearTimeout(handle);
        event_hub.unregisterTxEvent(transaction_id_string);
        event_hub.disconnect();
        // now let the application know what happened
        var return_status = {
          event_status: code,
          tx_id: transaction_id_string
        };
        if(code !== 'VALID') {
          console.error('The transaction was invalid, code = ' + code);
          resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
        } else {
          //console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
          resolve(return_status);
        }
      }, (err) => {
        reject(new Error('There was a problem with the eventhub ::' + err));
      });
    });
    promises.push(txPromise);
    var results = await Promise.all(promises);
    //console.log('Send transaction promise and event listener promise have completed');
    // check the results in the order the promises were added to the promise all list
    if(results && results[0] && results[0].status === 'SUCCESS') {
      console.log('Successfully sent transaction to the orderer.');
    } else {
      throw new Error('Failed to order the transaction. Error code: ' + results.status);
    }
    if(results && results[1] && results[1].event_status === 'VALID') {
      console.log('Successfully committed the change to the ledger by the peer');
      //console.log("Transaction Id " + results[1].tx_id);
      return JSON.stringify({
        txId: results[1].tx_id
      });
    } else {
      throw new Error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
    }
  } catch(e) {
    throw e;
  }
}