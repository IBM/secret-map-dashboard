## Instructions for setting the blockchainNetwork

### Open a new terminal and run the following command:
```bash
export FABRIC_CFG_PATH=$(pwd)
chmod +x cryptogen
chmod +x configtxgen
chmod +x generate-certs.sh
chmod +x generate-cfgtx.sh
chmod +x docker-images.sh
chmod +x build.sh
chmod +x clean.sh
./build.sh
docker-compose -p "fitcoin" up -d
```

###  Check the logs for fitcoin and shop backend

**Command**
```bash
docker ps
```
**Output:**
```
4d5ee8eadd4        dev-shop-peer-bcfit-v2-ca8dacbabdbb7db6cefd9e0b0f95f7dd2126364505d98af5b8f43f357b5a9a14   "chaincode -peer.a..."   8 minutes ago        Up 8 minutes                                                         dev-shop-peer-bcfit-v2
98b58f17ce1c        fitcoin-backend                                                                           "node index.js"          9 minutes ago       Up 8 minutes        0.0.0.0:3002->3000/tcp                           fitcoin-backend
92e4789e8e80        fitcoin-peer                                                                              "peer node start"        9 minutes ago       Up 9 minutes        0.0.0.0:8051->7051/tcp, 0.0.0.0:8053->7053/tcp   fitcoin-peer
da6207a9ff14        shop-backend                                                                              "node index.js"          9 minutes ago       Up 9 minutes        0.0.0.0:3001->3000/tcp                           shop-backend
e64fed71f6ee        shop-peer                                                                                 "peer node start"        9 minutes ago       Up 9 minutes        0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   shop-peer
09f2027b3e60        hyperledger/fabric-couchdb:x86_64-1.0.2                                                   "tini -- /docker-e..."   9 minutes ago       Up 9 minutes        4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb0
ce7789a9e8ed        orderer                                                                                   "orderer"                9 minutes ago       Up 9 minutes        0.0.0.0:7050->7050/tcp                           orderer0
b68b160dfffd        hyperledger/fabric-couchdb:x86_64-1.0.2                                                   "tini -- /docker-e..."   9 minutes ago       Up 9 minutes        4369/tcp, 9100/tcp, 0.0.0.0:6984->5984/tcp       couchdb1
d13fc2a87057        shop-ca                                                                                   "fabric-ca-server ..."   9 minutes ago       Up 9 minutes        0.0.0.0:7054->7054/tcp                           shop-ca
48868743df86        shop-ca                                                                                   "fabric-ca-server ..."   9 minutes ago       Up 9 minutes        0.0.0.0:8054->7054/tcp                           fitcoin-ca
Ishans
```


**Command**
```bash
docker logs shop-backend
```

**Output:**
```
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}
process.env.CREATE_CHANNEL  value :  true
Default channel not found, attempting creation...
Ishans-MacBook-Pro:blockchain ishan$ docker logs shop-backend
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}
process.env.CREATE_CHANNEL  value :  true
Default channel not found, attempting creation...
Successfully created a new default channel.
Joining peers to the default channel.
Chaincode is not installed, attempting installation...
Base container image present.
info: [packager/Golang.js]: packaging GOLANG from bcfit
Successfully installed chaincode on the Peer.
Successfully instantiated chaincode on channel.
```

**Command**
```bash
docker logs docker logs fitcoin-backend
```

**Output:**
```
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}
process.env.CREATE_CHANNEL  value :  false
Sleeping peer for 60 seconds.
Ishans-MacBook-Pro:blockchain ishan$ docker logs fitcoin-backend
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}
process.env.CREATE_CHANNEL  value :  false
Sleeping peer for 60 seconds.
Joining peers to the default channel.
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer","grpc.primary_user_agent":"grpc-node/1.8.0"}
Peer connected to the default channel.
Chaincode is not installed, attempting installation...
Base container image present.
info: [packager/Golang.js]: packaging GOLANG from bcfit
Successfully installed chaincode on the Peer.
Chaincode is already instantiated on channel.
```
