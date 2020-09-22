const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')

const ipfs = IpfsHttpClient()

async function getIPFS(cid, filename){
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

module.exports = {
    getIPFS,
};
