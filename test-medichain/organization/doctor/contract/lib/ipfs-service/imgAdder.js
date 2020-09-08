const IpfsHttpClient = require('ipfs-http-client');  // need a IPFS Daemon

const ipfs = IpfsHttpClient();


async function addipfs(filename){
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

addipfs('./images/RA.bmp');
