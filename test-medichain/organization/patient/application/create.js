/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access Medichain Net network
 * 4. Construct request to create medical data
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');

// create program function
async function create(patientId, patientHash) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(`../identity/user/${patientId}/wallet`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        // Specify userName for network access
        // const userName = 'doctorId@doctor.com';
        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: patientId,
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
        const createResponse = await contract.submitTransaction('CreatePatientHash', patientHash);

        // process response
        console.log('Process create transaction response.' + createResponse);
        let patientData = Buffer.from(JSON.stringify(createResponse));

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

// Node 로 실행 시 인자값 - patientId, patientHash
create(process.argv[2], process.argv[3]).then(() => {
    console.log('Create program complete.');
}).catch((e) => {
    console.log('Create program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

module.exports = {
    create,
};
