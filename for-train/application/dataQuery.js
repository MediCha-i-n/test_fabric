'use strict';

const { getIPFS } = require('./imgGetter');
const { connectChain } = require('./externalConnect');

const { Wallets, Gateway } = require('fabric-network');
const path = require('path');

async function mainQuery(trainerName) {
    const result = ['', ''];
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, `../identity/user/${trainerName}/wallet`));

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        const contract = await connectChain(gateway, wallet, trainerName);

        // query medical data
        console.log('Evaluate patientHash Data query transaction.');
        const queryResponse = await contract.evaluateTransaction('GetPatientHashHistory', trainerName);

        // process response
        console.log('Process query transaction response.');
        const queryData = JSON.parse(queryResponse.toString());
        console.log('Transaction complete.');

        for (const oneData of queryData) {
            if (oneData.Value) {
                const value = oneData.Value;
                if (value.rawImgCID && value.resultImgCID) {
                    const originBuf = await getIPFS(value.rawImgCID);
                    const truthBuf = await getIPFS(value.resultImgCID);
                    console.log(originBuf.toString('base64'));
                    console.log(truthBuf.toString('base64'));
                }
            }
        }
        return result;
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
        return result;
    })
    .catch((err) => {
        console.error(err.message);
    });
