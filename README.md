# MediChA.I.n Test Fabric

메디체인 패브릭 구성환경을 테스트 및 개발하기 위한 레포지토리

(Ubuntu 18.04, WSL2 사용 - Window Version 2004 이상)

[Hyperledger-Fabric 공식 레퍼런스 참조](https://hyperledger-fabric.readthedocs.io/en/release-2.2)

1. Prerequisites

Git, cURL, wget, docker (version 17.06.2 ce 이상),
docker-compose(version 1.14.0 이상), Go(version 1.13.x 이상),
Node.js(version 12.13.1 이상), npm (version 6이상), Python(version 2.7)

WSL2 로 Docker 구동 위해서는 Docker For Window 설치해야함.

npm 오류 해결 위해

```shell script
sudo apt-get install build-essential
```

- Git 설치:
```shell script
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update && sudo apt-get dist-upgrade
sudo apt-get install git-core
git version
```
- cURL 설치
```shell script
sudo apt-get install -y curl
curl --version
```

- Docker & Docker compose 설치 (Ubuntu 용, WSL2에서는 Docker for Window 사용)
```shell script
sudo apt-get update && sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update && sudo apt-cache search docker-ce
sudo apt-get update && sudo apt-get install docker-ce
sudo usermod -aG docker $USER
sudo service docker restart (or sudo chmod 666 /var/run/docker.sock)
docker --version
sudo systemctl start docker
sudo systemctl enable docker

sudo curl -L https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```
마지막에서 네 번째 문장은 시스템 실행될때 도커 키기 위함.

- Node.js & npm 설치
```shell script
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# update 시
sudo npm cache clean -f 
sudo npm install -g n 
sudo n stable

sudo curl -L https://npmjs.org/install.sh | sh
sudo npm update -g npm
```

- Go 설치
```shell script
mkdir golang && cd golang
wget https://dl.google.com/go/go1.14.linux-amd64.tar.gz

sudo tar -zxvf go1.12.9.linux-amd64.tar.gz -C /usr/local
export PATH=$PATH:/usr/local/go/bin
go version
go env

vim .bashrc
# export PATH=$PATH:/usr/local/go/bin
# export GOPATH=$HOME/go 입력
source .bashrc
```

1. Install sample & Copy Requirement

```shell script
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.0 1.4.7
export PATH=<path to download location>/bin$PATH
```