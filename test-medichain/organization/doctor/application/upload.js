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
 * 4. Construct request to upload medical data
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');

// upload program function
async function upload(doctorId, patientHash, rawImgCid, resultImgCid) {

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
        console.log('Use org.medichainnet.medichain smart contract.');
        const contract = await network.getContract('medichain');

        // upload medical data
        console.log('Submit medical data upload transaction.');
        const uploadResponse = await contract.submitTransaction('UploadPatientHash', patientHash, doctorId, rawImgCid, resultImgCid);

        // process response
        console.log('Process upload transaction response.' + uploadResponse);
        let patientData = Buffer.from(JSON.stringify(uploadResponse));

        console.log(patientData);
        console.log('Transaction complete.');
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
    return true;
}

// Node 로 실행 시 인자값 - doctorId, patientHash, rawImgCID, resultImgCID
upload(process.argv[2], process.argv[3], process.argv[4], process.argv[5]).then(() => {
    console.log('Upload program complete.');
}).catch((e) => {
    console.log('Upload program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

module.exports = {
    upload,
};
