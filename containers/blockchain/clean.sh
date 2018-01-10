#!/bin/bash

# shellcheck disable=SC2046
docker rm -f $(docker ps -aq)
images=( fitcoin-backend shop-backend fitcoin-ca shop-ca orderer fitcoin-peer shop-peer )
for i in "${images[@]}"
do
	echo Removing image : "$i"
  docker rmi -f "$i"
done

#docker rmi -f $(docker images | grep none)
images=( dev-shop-peer dev-fitcoin-peer)
for i in "${images[@]}"
do
	echo Removing image : "$i"
  docker rmi -f "$(docker images | grep "$i" )"
done

docker rmi "$(docker images -f "dangling=true" -q)"
