'use strict';

const { connectChain } = require('./externalConnect');

const { Wallets, Gateway } = require('fabric-network');

async function getTotalCount(trainerName) {
    let count = 0;
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(`../identity/user/${trainerName}/wallet`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        const contract = await connectChain(gateway, wallet, trainerName);

        // query medical data
        console.log('Evaluate current allPatientHash query transaction.');
        const queryResponse = await contract.evaluateTransaction('GetAllPatientHashCurrent');

        // process response
        console.log('Process query transaction response.');
        const queryData = JSON.parse(queryResponse.toString());
        console.log('Transaction complete.');

        for (const oneData of queryData) {
            if (oneData.Record) {
                const record = oneData.Record;
                if (record.enrollNumber > 0) {
                    count += record.enrollNumber;
                }
            }
        }
        return count;
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

getTotalCount(process.argv[2])
    .then((result) => {
        console.log(result);
        return result;
    })
    .catch((err) => {
        console.error(err.message);
    });
