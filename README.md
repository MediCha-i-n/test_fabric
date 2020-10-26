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

docker-compose 까지는 requisitesInstall.sh 이용
```shell script
chmod 777 /requisitesInstall.sh
chmod 777 test-medichain/organization/doctor/configuration/cli/monitordocker.sh
```

1. Install sample & Copy Requirement

```shell script
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.0 1.4.7
export PATH=<path to download location>/bin$PATH
```

2. Explorer Setting

```shell script
docker pull hyperledger/explorer
docker pull hyperledger/explorer-db

wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/examples/net1/config.json
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/examples/net1/connection-profile/first-network.json -P connection-profile
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/docker-compose.yaml

# 네트워크 실행 후 (test_fabric 에서)
cd docker-explorer & mkdir organizations
cp -r test-network/organizations/peerOrganizations docker-explorer/organizations
cp -r test-network/organizations/ordererOrganizations docker-explorer/organizations

cd docker-explorer
vim connection-profile/first-network.json

# 실행 - 8001 포트
docker-compose up -d
docker-compose down -v
```

3. Implement Blockchain

Org1: Doctor, Org2: Patient

체인코드 배포
```shell script
# organization/doctor 에서
exec bash
source doctor.sh
exec zsh
peer lifecycle chaincode package cp.tar.gz --lang node --path ../../contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

2020-09-15 02:13:51.680 KST [cli.lifecycle.chaincode] submitInstallProposal -> INFO 001 Installed remotely: response:<status:200 payload:"\nEcp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457\022\004cp_0" >
2020-09-15 02:13:51.680 KST [cli.lifecycle.chaincode] submitInstallProposal -> INFO 002 Chaincode code package identifier: cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457

peer lifecycle chaincode queryinstalled

Installed chaincodes on peer:
Package ID: cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457, Label: cp_0

export PACKAGE_ID=cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457
peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name medichain -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

2020-09-15 02:18:10.353 KST [chaincodeCmd] ClientWait -> INFO 001 txid [2378792a689b54098eafa079f42308f46364ad75624ddf5b8f2edcbac44cdae8] committed with status (VALID) at
```

```shell script
# organization/patient 에서
exec bash
source patient.sh
exec zsh
peer lifecycle chaincode package cp.tar.gz --lang node --path ../../contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

2020-09-15 02:21:13.590 KST [cli.lifecycle.chaincode] submitInstallProposal -> INFO 001 Installed remotely: response:<status:200 payload:"\nEcp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457\022\004cp_0" >
2020-09-15 02:21:13.590 KST [cli.lifecycle.chaincode] submitInstallProposal -> INFO 002 Chaincode code package identifier: cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457

peer lifecycle chaincode queryinstalled

Installed chaincodes on peer:
Package ID: cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457, Label: cp_0

export PACKAGE_ID=cp_0:902515da4199224eae88b688aeb0c64c1a7d2622875b37cb4d8d8dfd1b309457
peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name medichain -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

2020-09-15 02:22:14.555 KST [chaincodeCmd] ClientWait -> INFO 001 txid [50117ad845a4d633f9f9180421de68648ca04d84466cdf975c9a311356cb5c89] committed with status (VALID) at

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} --channelID mychannel --name medichain -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
2020-09-15 02:23:44.182 KST [chaincodeCmd] ClientWait -> INFO 001 txid [d541cbd2075be1e0763b410bde42970825ae5ec19cd4df767d55ae5f51ca9121] committed with status (VALID) at localhost:7051
2020-09-15 02:23:44.196 KST [chaincodeCmd] ClientWait -> INFO 002 txid [d541cbd2075be1e0763b410bde42970825ae5ec19cd4df767d55ae5f51ca9121] committed with status (VALID) at localhost:9051

peer chaincode query -C mychannel -n medichain -c '{"Args":["PatientHashExists","123"]}'
```

enrollUser CA 관리자 아이디 등록
```shell script
node enrollUser.js
```

addToWallet Client 아이디 등록
```shell script
node addToWallet.js
```

upload (doctor)
```shell script
node upload.js doctor1 patientHash1 rawcid resultcid
```

query (doctor)
```shell script
node query.js patientHash1
```

result
```json
[
  {
    Timestamp: { seconds: [Object], nanos: 948000000 },
    Value: {
      doctorID: 'doctor',
      enrollNumber: 3,
      patientHash: 'patientHash1',
      rawImgCID: 'QmZEK63Z81aQ9oavNyV8xiDqT9YeuqY8kV8gUn1AeXb65r',
      resultImgCID: 'QmXotXzaZ4s8BHEsWhXYAfVPkji3FNNCs6Xd9Ne4yH3cph'
    }
  },
  {
    Timestamp: { seconds: [Object], nanos: 134000000 },
    Value: {
      doctorID: 'doctor',
      enrollNumber: 2,
      patientHash: 'patientHash1',
      rawImgCID: 'QmYdsKciEobSYvJXpmJUCnyF7s1otEBUQs8E97oHq8WJfw',
      resultImgCID: 'QmbdqCVPxFqjxDtCBUhrfEQU11VQkrnatobedVFfHqKEgd'
    }
  },
  {
    Timestamp: { seconds: [Object], nanos: 45000000 },
    Value: {
      patientHash: 'patientHash1',
      enrollNumber: 1,
      doctorID: 'doctor',
      rawImgCID: 'QmVWn1q82hNNJSttYgNAhhHE6iMdcTHS2VF6C2zTTbKg6o',
      resultImgCID: 'QmeSSVxj2qozvTQAQWhnCcsq6J8HAUmTV14LvWrdRps8Wn'
    }
  }
]
```

- 외부로 파일 가져오기 (ssh 이용)
```shell script
scp {user}@{server ip}:{dir 절대경로} {받는 곳 절대 경로}
```

- Host 변경 (orderer.example.com / peer0.org1.example.com / peer0.org2.example.com 모두)을 통해 외부에서 접근 가능

Ubuntu의 경우
```shell script
sudo vim /etc/hosts
```

Window 의 경우
```shell script
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "{ip}`t{host name}" -Force
```
