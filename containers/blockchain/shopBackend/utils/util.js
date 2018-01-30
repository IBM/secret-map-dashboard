import config from '../set-up/config';
import invokeFunc from '../set-up/invoke';
import queryFunc from '../set-up/query';
const uuidv4 = require('uuid/v4');
async function invokeChaincode(type, client, params) {
  var values = typeof params !== "string" ? params : JSON.parse(params);
  if(!values.userId) {
    throw new Error('Missing UserId');
  } else {
    if(!values.fcn) {
      throw new Error('Missing function name');
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""];
    }
    var func = null;
    if(type === "query") {
      func = queryFunc;
    } else {
      func = invokeFunc;
    }
    return func(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      return {
        message: "success",
        result: result
      };
    }).catch(err => {
      throw err;
    });
  }
}
async function enrollUser(client, params) {
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var userId = uuidv4();
  return client.registerAndEnroll(userId).then((user) => {
    console.log("Successfully enrolled user " + userId);
    console.log(user);
    return invokeFunc(userId, client, config.chaincodeId, config.chaincodeVersion, "createMember", ["2"]);
  }).then((result) => {
    console.log("Enrolled User");
    console.log(result);
    return {
      message: "success",
      result: JSON.stringify({
        user: userId,
        orgId: data.orgId
      })
    };
  }).catch(err => {
    throw err;
  });
}
export async function execute(type, client, params) {
  switch(type) {
    case 'invoke':
    case 'query':
      return invokeChaincode(type, client, params);
    case 'enroll':
      return enrollUser(client, params);
    default:
      throw new Error('Invalid Function Call');
  }
}