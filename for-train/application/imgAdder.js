'use strict';

const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client');  // need a IPFS Daemon

const ipfs = IpfsHttpClient({
    port:4000
});

async function addIPFS(filename){
    const addOptions = {
        timeout: 10000
    };

    try{
        return await ipfs.add(fs.createReadStream(filename), addOptions);
    } catch(err) {
        console.log(err);
    }
    return false;
}

module.exports = {
    addIPFS,
};
