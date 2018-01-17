import {
  snakeToCamelCase,
  camelToSnakeCase
} from 'json-style-converter';
module.exports.wrapError = function(message, innerError) {
  let error = new Error(message);
  error.inner = innerError;
  console.log(error.message);
  throw error;
}
module.exports.marshalArgs = function(args) {
  if(!args) {
    return args;
  }
  if(typeof args === 'string') {
    return [args];
  }
  let snakeArgs = camelToSnakeCase(args);
  if(Array.isArray(args)) {
    return snakeArgs.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg.toString());
  }
  if(typeof args === 'object') {
    return [JSON.stringify(snakeArgs)];
  }
}
module.exports.unmarshalResult = function(result) {
  if(!Array.isArray(result)) {
    return result;
  }
  let buff = Buffer.concat(result);
  if(!Buffer.isBuffer(buff)) {
    return result;
  }
  let json = buff.toString('utf8');
  if(!json) {
    return null;
  }
  let obj = JSON.parse(json);
  return snakeToCamelCase(obj);
}
//function unmarshalBlock(block)
module.exports.unmarshalBlock = function(block) {
  const transactions = Array.isArray(block.data.data) ? block.data.data.map(({
    payload: {
      header,
      data
    }
  }) => {
    const {
      channel_header
    } = header;
    const {
      type,
      timestamp,
      epoch
    } = channel_header;
    return {
      type,
      timestamp
    };
  }) : [];
  return {
    id: block.header.number.toString(),
    fingerprint: block.header.data_hash.slice(0, 20),
    transactions
  };
}