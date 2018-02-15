#!/bin/bash
export FABRIC_CFG_PATH=$PWD
sh ./generate-certs.sh
sh ./docker-images.sh
docker-compose -p "fitcoin" up -d blockchain-setup
sleep 30s
docker-compose -p "fitcoin" up -d rabbitmq
sleep 60s
docker exec rabbitmq1 /bin/sh -c "rabbitmqctl set_policy ha-all '.' \"{'ha-mode':'all','ha-sync-mode':'automatic'}\""
sleep 10s
docker-compose -p "fitcoin" up -d
sleep 1s
docker ps
