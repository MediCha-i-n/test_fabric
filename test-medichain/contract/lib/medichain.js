'use strict';

const { Contract } = require('fabric-contract-api');

class Medichain extends Contract {
    // PatientDataExists returns true when patient hash exists in world state
    async PatientHashExists(ctx, patientHash) {
        // Check if medical data already exists
        let medicalDataState = await ctx.stub.getState(patientHash);
        return medicalDataState && medicalDataState.length > 0;
    }

    // Create - create a new patient hash
    async CreatePatientHash(ctx, patientHash) {
        const exists = await this.PatientHashExists(ctx, patientHash);
        if (exists) {
            throw new Error(`The patient ${patientHash} already exists`);
        }

        // Create Medical Data object and marshal to JSON
        let medicalData = {
            patientHash: patientHash,
            enrollNumber: 0,
            doctorNumber: 0,  // 의사 번호
            rawImgCID: '', // 원본이미지 CID
            resultImgCID: '', // 결과이미지 CID
        };

        // Save medical data to state
        await ctx.stub.putState(patientHash, Buffer.from(JSON.stringify(medicalData)));
        return Buffer.from(JSON.stringify(medicalData));
    }

    // Upload New Result
    async UploadPatientHash(ctx, doctorNumber, patientHash, rawImgCID, resultImgCID) {
        let medicalDataAsBytes = await ctx.stub.getState(patientHash);
        if (!medicalDataAsBytes || !medicalDataAsBytes.toString()) {
            console.log(`Patient Hash ${patientHash} does not exist`);
            medicalDataAsBytes = await this.CreatePatientHash(ctx, patientHash);
        }
        let medicalDataUpdate = {};
        try {
            medicalDataUpdate = JSON.parse(medicalDataAsBytes.toString());
        } catch (err) {
            let jsonResp = {};
            jsonResp.error = 'Failed to decode JSON of: ' + patientHash;
            throw new Error(jsonResp);
        }
        medicalDataUpdate.enrollNumber += 1;
        medicalDataUpdate.doctorNumber = doctorNumber;
        medicalDataUpdate.rawImgCID = rawImgCID;
        medicalDataUpdate.resultImgCID = resultImgCID;

        let medicalDataJSONasBytes = Buffer.from(JSON.stringify(medicalDataUpdate));
        await ctx.stub.putState(patientHash, medicalDataJSONasBytes);
        return medicalDataUpdate;
    }

    async GetPatientHashHistory(ctx, patientHash) {
        const exists = await this.PatientHashExists(ctx, patientHash);
        if (!exists) {
            throw new Error(`Patient Hash ${patientHash} does not exist`);
        }
        let resultsIterator = await ctx.stub.getHistoryForKey(patientHash);
        return await this.GetAllResults(resultsIterator, true);
    }

    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
}

module.exports = Medichain;
