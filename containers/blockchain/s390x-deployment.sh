# do source ./s390x-env.sh

# replace Dockerfiles

sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g blockchainNetwork/Dockerfile
sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g fitcoinCertificateAuthority/Dockerfile
sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g fitcoinPeer/Dockerfile
sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g shopCertificateAuthority/Dockerfile
sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g shopPeer/Dockerfile
sed -i s#x86_64-1.0.2#"$FABRIC_TAG"#g orderer/Dockerfile

# replace yaml file

mv docker-compose.yaml docker-compose-x86.yaml
mv docker-compose-s390x.yaml docker-compose.yaml

# replace binaries
mv cryptogen cryptogen-x86
mv configtxgen configtxgen-x86
mv s390x-binaries/cryptogen cryptogen
mv s390x-binaries/configtxgen configtxgen
