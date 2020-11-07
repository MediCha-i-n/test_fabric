const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')

const ipfs = IpfsHttpClient()

async function getipfs(cid, filename){
    for await (const file of ipfs.get(cid)) {
        if (!file.content) continue;

        const content = []

        for await (const chunk of file.content) {
            content.push(chunk)
        }

        const buf = Buffer.concat(content);

        fs.writeFileSync(filename, buf, 'base64')
        return buf;
    }
}

const cidOrigin = 'QmXotXzaZ4s8BHEsWhXYAfVPkji3FNNCs6Xd9Ne4yH3cph';
const cidTruth = 'QmZEK63Z81aQ9oavNyV8xiDqT9YeuqY8kV8gUn1AeXb65r';

getipfs(cidOrigin, './ipfs_origin.tif').then((result) => {
    console.log(result.toString('base64'));
});
getipfs(cidTruth, './ipfs_truth.tif').then((result) => {
    console.log(result.toString('base64'));
});
