const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')

const ipfs = IpfsHttpClient()

async function getIpfs(cid, filename){
    for await (const file of ipfs.get(cid)) {
        console.log(file.path)

        if (!file.content) continue;

        const content = []

        for await (const chunk of file.content) {
            content.push(chunk)
        }

        const buffers = [];

        content.forEach(bufferlist => {
            buffers.push(bufferlist._bufs[0])
        });

        const buf = Buffer.concat(buffers);

        fs.writeFileSync(filename, buf, 'base64')
    }
}

module.exports = {
    getIpfs,
};
