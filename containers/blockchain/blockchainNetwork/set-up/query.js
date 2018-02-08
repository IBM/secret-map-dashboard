'use strict';
export default async function (userId, clientObject, chaincodeId, chaincodeVersion, fcn, args) {
  try {
    var user_from_store = await clientObject._client.getUserContext(userId, true);
    if(!(user_from_store && user_from_store.isEnrolled())) {
      throw new Error('Failed to get user : ' + userId + ' from persistence');
    }
    //console.log('Successfully loaded user : ' + userId + ' from persistence');
    const request = {
      //targets : --- letting this default to the peers assigned to the channel
      chaincodeId: chaincodeId,
      chaincodeVersion: chaincodeVersion,
      fcn: fcn,
      args: args
    };
    const query_responses = await clientObject._channel.queryByChaincode(request, user_from_store);
    //console.log("Query has completed, checking results");
    // query_responses could have more than one  results if there multiple peers were used as targets
    if(query_responses && query_responses.length == 1) {
      if(query_responses[0] instanceof Error) {
        throw new Error("Error from query = ", query_responses[0].message);
      } else {
        //console.log("Query Response : " + query_responses);
        /*return JSON.stringify({
          response: query_responses.toString('utf8')
        });*/
        return query_responses.toString('utf8');
      }
    } else {
      throw new Error("No payloads were returned from query");
    }
  } catch(e) {
    throw e;
  }
}