const buffer = require('buffer');
const path = require('path');
const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')

let filename = 'maven.png'

const { globSource } = IpfsHttpClient
const ipfs = IpfsHttpClient()

let hash;

async function addipfs(filename){
    const file = await ipfs.add(globSource(filename, {recursive: true}));
    console.log(file)
}

const BufferList = require('bl/Bufferlist')
const cid = 'QmcZBnQP19WYj9vuojfiYrckspvdt7sPSYZ78nciL8si72'

async function getipfs(cid, filename){
    for await (const file of ipfs.get(cid)) {
        console.log(file.path)

        if (!file.content) continue;

        const content = new BufferList();
        for await (const chunk of file.content) {
            content.append(chunk)
        }

        console.log(content.toString())
    }
}
