'use strict';

const { addIPFS } = require('./imgAdder');
const { connectChain } = require('./externalConnect');

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const targetDirArr = ['CVC-ClinicDB', 'CVC-ColonDB', 'ETIS-LaribPolypDB'];

function getImgSetPath(targetDir) {
    const pathSet = [];

    const originPath = path.join(__dirname, `../../data/${targetDir}/Original`);
    const truthPath = path.join(__dirname, `../../data/${targetDir}/Ground Truth`);

    const originFiles = fs.readdirSync(originPath);
    const truthFiles = fs.readdirSync(truthPath);

    if (originFiles.length !== truthFiles.length) {
        console.log('Length Error - Difference');
        return;
    }

    for (const idx in originFiles) {
        pathSet.push([path.join(originPath, originFiles[idx]),path.join(truthPath, truthFiles[idx])]);
    }
    return pathSet;
}

async function mainUpload(trainerNumber) {
    const targetDir = targetDirArr[trainerNumber-1];
    const results = [];

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet(`../identity/user/trainer${trainerNumber}/wallet`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        const contract = await connectChain(gateway, wallet, `trainer${trainerNumber}`);

        const pathSet = getImgSetPath(targetDir);
        for (const onePath of pathSet) {
            const originCID = await addIPFS(onePath[0]);
            const truthCID = await addIPFS(onePath[1]);

            console.log('Submit medical data upload transaction.');
            const response = await contract.submitTransaction('UploadPatientHash', 0, `trainer${trainerNumber}`, originCID.path, truthCID.path);

            // process response
            console.log('Process upload transaction response.');
            const data = Buffer.from(JSON.stringify(response));
            results.push(data);

            console.log('Transaction complete.');
        }
        return results;

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

mainUpload(process.argv[2])
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.error(err.message);
    });