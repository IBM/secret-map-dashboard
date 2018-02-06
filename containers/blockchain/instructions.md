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
docker-compose -p "fitcoin" up -d blockchain-setup
```

###  Check the logs

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
docker ps
```
**Output:**
```bash
CONTAINER ID        IMAGE                                                                                    COMMAND                  CREATED             STATUS              PORTS                                            NAMES
66f65a353e58        fitcoin-backend                                                                          "node index.js"          20 seconds ago      Up 23 seconds       0.0.0.0:3001->3000/tcp                           fitcoin-backend
a8bba26cf3d4        shop-backend                                                                             "node index.js"          20 seconds ago      Up 24 seconds       0.0.0.0:3002->3000/tcp                           shop-backend
4d8bd8e6e5cf        dev-shop-peer-bcfit-1-0e0d4e71de9ac7df4d0d20dfcf583e3e63227edda600fe338485053387e09c50   "chaincode -peer.add…"   4 minutes ago       Up 4 minutes                                                         dev-shop-peer-bcfit-1
2eb73e45a372        blockchain-setup                                                                         "node index.js"          5 minutes ago       Up 5 minutes        3000/tcp                                         blockchain-setup
2cd17faea02c        fitcoin-peer                                                                             "peer node start"        5 minutes ago       Up 5 minutes        0.0.0.0:8051->7051/tcp, 0.0.0.0:8053->7053/tcp   fitcoin-peer
ef97bd92a3bc        shop-peer                                                                                "peer node start"        5 minutes ago       Up 5 minutes        0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   shop-peer
877033a93f5c        hyperledger/fabric-couchdb:x86_64-1.0.2                                                  "tini -- /docker-ent…"   5 minutes ago       Up 5 minutes        4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb0
474edd5b491f        fitcoin-ca                                                                               "fabric-ca-server st…"   5 minutes ago       Up 5 minutes        0.0.0.0:8054->7054/tcp                           fitcoin-ca
52e78c89a130        orderer-peer                                                                             "orderer"                5 minutes ago       Up 5 minutes        0.0.0.0:7050->7050/tcp                           orderer0
704be331bbbb        hyperledger/fabric-couchdb:x86_64-1.0.2                                                  "tini -- /docker-ent…"   5 minutes ago       Up 5 minutes        4369/tcp, 9100/tcp, 0.0.0.0:6984->5984/tcp       couchdb1
ba70779b5c65        shop-ca                                                                                  "fabric-ca-server st…"   5 minutes ago       Up 5 minutes        0.0.0.0:7054->7054/tcp                           shop-ca
```

**Command**
```bash
docker-compose -p "fitcoin" up -d
```

**Command**
```bash
docker logs fitcoin-backend
```
**Output:**
```
Register CA fitcoin-org
CA registration complete  FabricCAServices : {hostname: fitcoin-ca, port: 7054}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}
Server running on port: 3000
```

**Command**
```bash
docker logs shop-backend
```
**Output:**
```
Register CA shop-org
CA registration complete  FabricCAServices : {hostname: shop-ca, port: 7054}
info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}
Server running on port: 3000
```

**To view the Blockchain Events**

In a separate terminal navigate to testApplication folder and run the following command:
```
npm install
node index.js
```
Navigate to url to view the blockchain blocks: **http://localhost:8000/history.html**
Now navigate to url to perform operations on network : **http://localhost:8000/test.html**

**Sample  values for request**

**Invoke Operation**
```
type = invoke
userId = admin
fcn = move
args = a,b,10
```

**Query Operation**
```
type = query
userId = admin
fcn = query
args = a
```

**Query Operation**
```
type = query
userId = admin
fcn = query
args = b
```
