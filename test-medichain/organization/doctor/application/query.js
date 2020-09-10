/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access MedichainNet network
 * 4. Construct request to query medical data
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const MedicalData = require('../contract/lib/mediData');
const { getIpfs } = require('./ipfs-service/imgGetter');

// query program function
async function query(doctorId, patientHash) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(`../identity/user/${doctorId}/wallet`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'doctorId@doctor.com';
        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: doctorId,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.medichainnet.medicaldata smart contract.');
        const contract = await network.getContract('medicaldatacontract');

        // query medical data
        console.log('Evaluate medical data query transaction.');
        const queryResponse = await contract.evaluateTransaction('query', patientHash);

        // process response
        console.log('Process query transaction response.' + queryResponse);
        let medicalData = MedicalData.fromBuffer(queryResponse);
        console.log(`${medicalData.doctor} upload : ${medicalData.patientHash} successfully query`);
        console.log('Transaction complete.');

        // Find IPFS Img
        medicalData.rawImgPath = await getIpfs(medicalData.rawImgCid);
        medicalData.resultImgPath = await getIpfs(medicalData.resultImgCid);

        // return data
        return medicalData;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

// Node 로 실행 시 인자값 - doctorId, patientHash
query(process.argv[2], process.argv[3]).then(() => {
    console.log('Query program complete.');
}).catch((e) => {
    console.log('Query program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

module.exports = {
    query,
};
