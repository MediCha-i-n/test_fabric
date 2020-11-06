/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

async function connectChain(gateway, wallet) {
    try {
        // Specify userName for network access
        // const userName = 'training@doctor.com';
        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml'), 'utf8');

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: 'training',
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: false }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');
        /* await network.addBlockListener(
            async (err, blockNum, block) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(blockNum, blockNum.blockData);
                console.log(block);
            }
        ); */

        // Get addressability to commercial paper contract
        console.log('Use org.medichainnet.medichain smart contract.');
        return await network.getContract('medichain');

    } catch (err) {
        console.error('connectChain() error');
        console.error(err.message);
        throw err;
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

module.exports = {
    connectChain,
};
