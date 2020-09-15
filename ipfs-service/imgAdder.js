'use strict';

const IpfsHttpClient = require('ipfs-http-client');  // need a IPFS Daemon
const fs = require('fs');

const ipfs = IpfsHttpClient();


async function addIpfs(filename){
    const addOptions = {
        timeout: 10000
    };

    try{
        const file = await ipfs.add(fs.createReadStream(filename), addOptions);
        console.log(file);
    } catch(err) {
        console.log(err);
    }
}

// addIpfs('./images/RA.bmp');
module.exports = {
    addIpfs
};
