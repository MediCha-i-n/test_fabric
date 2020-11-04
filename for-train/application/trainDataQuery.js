'use strict';

const { getIPFS } = require('./imgGetter');
const { connectChain } = require('./externalConnect');

const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

async function mainQuery(patientHash) {
    const promises = [];

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
        console.log('Process query transaction response.');
        const queryData = JSON.parse(queryResponse.toString());
        console.log('Transaction complete.');

        for (const oneData of queryData) {
            if (oneData.Value) {
                const value = oneData.Value;
                if (value.rawImgCID && value.resultImgCID) {
                    promises.push(getIPFS(value.rawImgCID));
                    promises.push(getIPFS(value.resultImgCID));
                }
            }
        }

        return await Promise.all(promises);
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

mainQuery(process.argv[2])
    .then((result) => {
        console.log(result);
        return result;
    })
    .catch((err) => {
        console.error(err.message);
    });
