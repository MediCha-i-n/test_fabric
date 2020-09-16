const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')  // need a IPFS Daemon

const ipfs = IpfsHttpClient()

async function addipfs(filename){
    const addOptions = {
        timeout: 10000
    }

    try{
        return await ipfs.add(fs.createReadStream(filename), addOptions);
    } catch(err) {
        console.log(err)
    }
    return false;
}

addipfs('./sampleImages/original/3.tif').then((result) => {
    console.log(result);
})

addipfs('./sampleImages/ground-truth/3.tif').then((result) => {
    console.log(result);
})