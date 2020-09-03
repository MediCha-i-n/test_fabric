#!/bin/bash

sudo apt-get update
sudo apt-get install build-essential

sudo add-apt-repository ppa:git-core/ppa
sudo apt-get dist-upgrade
sudo apt-get install -y git-core

sudo apt-get install -y curl

sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-cache search docker-ce
sudo apt-get install -y docker-ce

sudo curl -L https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
