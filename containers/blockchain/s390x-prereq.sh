#!/bin/bash

# add linux1 to member of docker group
echo -e "adding linux1 to docker group"
sudo usermod -aG docker linux1

# install docker-compose
echo -e "*** Installing docker-compose. ***\n"
sudo zypper install -y python-pyOpenSSL python-setuptools
sudo easy_install pip
sudo pip install docker-compose==1.18.0
echo -e “*** Done with docker-compose. ***\n”

#Install NodeJS
echo -e “*** install_nodejs ***”
cd /tmp
wget -q https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-s390x.tar.gz
cd /usr/local && sudo tar --strip-components=1 -xzf /tmp/node-v6.9.5-linux-s390x.tar.gz
echo -e “*** Done withe NodeJS ***\n”

echo -e "YOU SHOULD LOG OUT OF VM THEN LOG BACK IN"
