'use strict';

const { getIPFS } = require('./imgGetter');
const { connectChain } = require('./externalConnect');

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

// query program function
async function mainQuery(patientHash) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/training/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        const contract = await connectChain(gateway, wallet);

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

mainQuery('train0')
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.error(err.message);
    });
