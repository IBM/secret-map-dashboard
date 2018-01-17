FROM docker.io/library/node:6.11.3

ENV DOCKER_SOCKET_PATH /host/var/run/docker.sock
ENV DOCKER_CCENV_IMAGE hyperledger/fabric-ccenv:x86_64-1.0.2

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install

CMD ["node", "index.js"]
