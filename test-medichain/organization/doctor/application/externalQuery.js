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
 * 4. Construct request to query medical data
 * 5. Evaluate transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');

// query program function
async function query(patientHash) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/doctorAdmin/wallet');

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
            identity: 'doctorAdmin',
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: false }
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

        // query medical data
        console.log('Evaluate patientHash Data query transaction.');
        const queryResponse = await contract.evaluateTransaction('GetPatientHashHistory', patientHash);

        // process response
        console.log('Process query transaction response.' + queryResponse);
        const queryData = JSON.parse(queryResponse.toString());
        console.log(queryData);

        console.log('Transaction complete.');
        return queryData;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

// Node 로 실행 시 인자값 - patientHash
query('test1').then(() => {
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
