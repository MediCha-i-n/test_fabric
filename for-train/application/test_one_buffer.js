'use strict';

const fs = require('fs');
const path = require('path');
const { getIPFS } = require('./imgGetter');

async function makeOneJSON(cid, name) {
    const result = await getIPFS(cid, path.join(__dirname, name));
    const jsonType = {
        example: result,
    };
    fs.writeFileSync(path.join(__dirname, '../name'), jsonType);
}

makeOneJSON('QmRLCxPh8Kmaj24AUSaexFcHPorSbDe5Mi4xZAhWJC2VxK', 'sample.json');