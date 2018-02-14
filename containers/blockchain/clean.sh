#!/bin/bash

docker rm -f $(docker ps -aq)
images=( backend-application blockchain-setup fitcoin-ca shop-ca orderer-peer fitcoin-peer shop-peer backend test-application)
for i in "${images[@]}"
do
	echo Removing image : $i
  docker rmi -f $i
done

#docker rmi -f $(docker images | grep none)
images=( dev-shop-peer dev-fitcoin-peer)
for i in "${images[@]}"
do
	echo Removing image : $i
  docker rmi -f $(docker images | grep $i )
done

docker rmi $(docker images -f "dangling=true" -q)
