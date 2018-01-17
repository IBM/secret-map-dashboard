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

###  Check the logs

**Command**
```bash
docker ps
```
**Output:**
```
664b5cc2e61        dev-shop-peer-bcfit-1.0-73612d59b68f057dad3d42502f90f208b56c9c73971b5ff135addc36deb3bf2d   "chaincode -peer.a..."   4 seconds ago       Up 3 seconds                                                         dev-shop-peer-bcfit-1.0
07416cb5de2f        fitcoin-peer                                                                               "peer node start"        47 seconds ago      Up 46 seconds       0.0.0.0:8051->7051/tcp, 0.0.0.0:8053->7053/tcp   fitcoin-peer
899a0fac6710        shop-peer                                                                                  "peer node start"        48 seconds ago      Up 47 seconds       0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   shop-peer
2ae60139f8b9        hyperledger/fabric-couchdb:x86_64-1.0.2                                                    "tini -- /docker-e..."   49 seconds ago      Up 48 seconds       4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb0
f38bb3efd8c9        orderer-peer                                                                               "orderer"                49 seconds ago      Up 48 seconds       0.0.0.0:7050->7050/tcp                           orderer0
951b0ba1c27a        hyperledger/fabric-couchdb:x86_64-1.0.2                                                    "tini -- /docker-e..."   49 seconds ago      Up 48 seconds       4369/tcp, 9100/tcp, 0.0.0.0:6984->5984/tcp       couchdb1
9898ccf02507        shop-ca                                                                                    "fabric-ca-server ..."   49 seconds ago      Up 48 seconds       0.0.0.0:7054->7054/tcp                           shop-ca
ba2690ac50fd        fitcoin-ca                                                                                 "fabric-ca-server ..."   49 seconds ago      Up 48 seconds       0.0.0.0:8054->7054/tcp                           fitcoin-ca
```


**Command**
```bash
docker logs blockchain-setup
```
**Output:**
```bash
Register CA fitcoin-org
CA registration complete  FabricCAServices : {hostname: fitcoin-ca, port: 7054}
Register CA shop-org
CA registration complete  FabricCAServices : {hostname: shop-ca, port: 7054}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}
Default channel not found, attempting creation...
Successfully created a new default channel.
Joining peers to the default channel.
Chaincode is not installed, attempting installation...
Base container image present.
info: [packager/Golang.js]: packaging GOLANG from bcfit
info: [packager/Golang.js]: packaging GOLANG from bcfit
Successfully installed chaincode on the default channel.
Successfully instantiated chaincode on all peers.
```

**Command**
```bash
docker rm -f backend-application
docker-compose -p "fitcoin" up -d
docker logs backend-application
```
**Output:**
```bash
Server running on port: 3000
Register CA shop-org
CA registration complete  FabricCAServices : {hostname: shop-ca, port: 7054}
Register CA fitcoin-org
CA registration complete  FabricCAServices : {hostname: fitcoin-ca, port: 7054}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}
```

**You can now do REST calls for enroll user, invoke and query operations on http://localhost:3000**
