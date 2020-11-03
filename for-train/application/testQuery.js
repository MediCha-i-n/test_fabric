const fs = require('fs');
const path = require('path');

const cid = 'QmRLCxPh8Kmaj24AUSaexFcHPorSbDe5Mi4xZAhWJC2VxK';
const fileName = path.join(__dirname, './sample.tif');

const { getIPFS } = require('./imgGetter');

getIPFS(cid, fileName).then((result) => {
    const strResult = result.toString('hex');
    fs.writeFileSync(path.join(__dirname, './sample.txt'), strResult);
});