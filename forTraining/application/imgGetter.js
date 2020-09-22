const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')

const ipfs = IpfsHttpClient()

async function getIPFS(cid, filename){
    for await (const file of ipfs.get(cid)) {
        console.log(file);
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

const cidRaw = 'QmVWn1q82hNNJSttYgNAhhHE6iMdcTHS2VF6C2zTTbKg6o';
const cidResult = 'QmeSSVxj2qozvTQAQWhnCcsq6J8HAUmTV14LvWrdRps8Wn';

/* getipfs(cidRaw, './result/ipfs_raw.tif').then(console.log);
getipfs(cidResult, './result/ipfs_origin.tif').then(console.log);
*/

module.exports = {
    getIPFS,
};
