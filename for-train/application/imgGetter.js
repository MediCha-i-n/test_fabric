const IpfsHttpClient = require('ipfs-http-client')

const ipfs = IpfsHttpClient()

async function getIPFS(cid){
    for await (const file of ipfs.get(cid)) {
        if (!file.content) continue;

        const content = []

        for await (const chunk of file.content) {
            content.push(chunk)
        }

        return Buffer.concat(content);
    }
}

module.exports = {
    getIPFS,
};
