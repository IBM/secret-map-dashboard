#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH
$PROJPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

sh generate-cfgtx.sh

rm -rf $PROJPATH/{orderer,shopPeer,fitcoinPeer}/crypto
mkdir $PROJPATH/{orderer,shopPeer,fitcoinPeer}/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto
cp -r $PEERS/shop-org/peers/shop-peer/{msp,tls} $PROJPATH/shopPeer/crypto
cp -r $PEERS/fitcoin-org/peers/fitcoin-peer/{msp,tls} $PROJPATH/fitcoinPeer/crypto
cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/

SHOPCAPATH=$PROJPATH/shopCertificateAuthority
FITCOINCAPATH=$PROJPATH/fitcoinCertificateAuthority

rm -rf {$SHOPCAPATH,$FITCOINCAPATH}/{ca,tls}
mkdir -p {$SHOPCAPATH,$FITCOINCAPATH}/{ca,tls}

cp $PEERS/shop-org/ca/* $SHOPCAPATH/ca
cp $PEERS/shop-org/tlsca/* $SHOPCAPATH/tls
mv $SHOPCAPATH/ca/*_sk $SHOPCAPATH/ca/key.pem
mv $SHOPCAPATH/ca/*-cert.pem $SHOPCAPATH/ca/cert.pem
mv $SHOPCAPATH/tls/*_sk $SHOPCAPATH/tls/key.pem
mv $SHOPCAPATH/tls/*-cert.pem $SHOPCAPATH/tls/cert.pem

cp $PEERS/fitcoin-org/ca/* $FITCOINCAPATH/ca
cp $PEERS/fitcoin-org/tlsca/* $FITCOINCAPATH/tls
mv $FITCOINCAPATH/ca/*_sk $FITCOINCAPATH/ca/key.pem
mv $FITCOINCAPATH/ca/*-cert.pem $FITCOINCAPATH/ca/cert.pem
mv $FITCOINCAPATH/tls/*_sk $FITCOINCAPATH/tls/key.pem
mv $FITCOINCAPATH/tls/*-cert.pem $FITCOINCAPATH/tls/cert.pem

WEBCERTS=$PROJPATH/blockchainNetwork/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/shopPeer/crypto/tls/ca.crt $WEBCERTS/shopOrg.pem
cp $PROJPATH/fitcoinPeer/crypto/tls/ca.crt $WEBCERTS/fitcoinOrg.pem
cp $PEERS/shop-org/users/Admin@shop-org/msp/keystore/* $WEBCERTS/Admin@shop-org-key.pem
cp $PEERS/shop-org/users/Admin@shop-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/keystore/* $WEBCERTS/Admin@fitcoin-org-key.pem
cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/signcerts/* $WEBCERTS/
mv $PROJPATH/blockchainNetwork/channel.tx $PROJPATH/blockchainNetwork/set-up/channel.tx

WEBCERTS=$PROJPATH/blockchainNetwork
BACKEND=$PROJPATH/backend
rm -rf $BACKEND/certs
rm -rf $BACKEND/set-up
rm -rf $BACKEND/chaincode
mkdir -p $BACKEND/certs
mkdir -p $BACKEND/set-up
mkdir -p $BACKEND/chaincode
cp -r $WEBCERTS/certs/* $BACKEND/certs/
cp -r $WEBCERTS/set-up/* $BACKEND/set-up/
cp -r $WEBCERTS/chaincode/* $BACKEND/chaincode/

#cp $PROJPATH/orderer/crypto/tls/ca.crt $SHOP/certs/ordererOrg.pem
#cp $PROJPATH/shopPeer/crypto/tls/ca.crt $SHOP/certs/shopOrg.pem
#cp $PEERS/shop-org/users/Admin@shop-org/msp/keystore/* $SHOP/certs/Admin@shop-org-key.pem
#cp $PEERS/shop-org/users/Admin@shop-org/msp/signcerts/* $SHOP/certs/
#cp -r $PROJPATH/blockchainNetwork/chaincode/* $SHOP/chaincode/
#cp $PROJPATH/blockchainNetwork/set-up/* $SHOP/set-up/
#cp $PROJPATH/configuration/shop-config.js $SHOP/set-up/config.js
#mv $SHOP/channel.tx $SHOP/set-up/channel.tx#

#FITCOIN=$PROJPATH/fitcoinBackend
#rm -rf $FITCOIN/certs
#rm -rf $FITCOIN/set-up
#rm -rf $FITCOIN/chaincode
#mkdir -p $FITCOIN/certs
#mkdir -p $FITCOIN/set-up
#mkdir -p $FITCOIN/chaincode
#cp $PROJPATH/orderer/crypto/tls/ca.crt $FITCOIN/certs/ordererOrg.pem
#cp $PROJPATH/fitcoinPeer/crypto/tls/ca.crt $FITCOIN/certs/fitcoinOrg.pem
#cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/keystore/* $FITCOIN/certs/Admin@fitcoin-org-key.pem
#cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/signcerts/* $FITCOIN/certs/
#cp -r $PROJPATH/blockchainNetwork/chaincode/* $FITCOIN/chaincode/
#cp $PROJPATH/blockchainNetwork/set-up/* $FITCOIN/set-up/
#cp $PROJPATH/configuration/fitcoin-config.js $FITCOIN/set-up/config.js
#mv $FITCOIN/channel.tx $FITCOIN/set-up/channel.tx

rm -rf $CLIPATH
