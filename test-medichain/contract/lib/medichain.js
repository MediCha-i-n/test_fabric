'use strict';

const { Contract } = require('fabric-contract-api');

class Medichain extends Contract {

    // Create - create a new medical data
    async CreateMedicalData(ctx, patientHash, enrollNumber, doctorID, rawImgCID, resultImgCID) {
        const exists = await this.MedicalDataExists(ctx, patientHash);
        if (exists) {
            throw new Error(`The patient ${patientHash} already exists`);
        }

        // Create Medical Data object and marshal to JSON
        let medicalData = {
            patientHash: patientHash,
            enrollNumber: enrollNumber,
            doctorID: doctorID,  // 의사 번호
            rawImgCID: rawImgCID,
            resultImgCID: resultImgCID,
        };

        // Save medical data to state
        await ctx.stub.putState(patientHash, Buffer.from(JSON.stringify(medicalData)));
    }

    // Upload New Result
    async UploadMedicalData(ctx, patientHash, doctorID, rawImgCID, resultImgCID) {
        let medicalDataAsBytes = await ctx.stub.getState(patientHash);
        if (!medicalDataAsBytes || !medicalDataAsBytes.toString()) {
            throw new Error(`Patient Hash ${patientHash} does not exist`);
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
        medicalDataUpdate.doctorID = doctorID;
        medicalDataUpdate.rawImgCID = rawImgCID;
        medicalDataUpdate.resultImgCID = resultImgCID;

        let medicalDataJSONasBytes = Buffer.from(JSON.stringify(medicalDataUpdate));
        await ctx.stub.putState(patientHash, medicalDataJSONasBytes);
    }

    async GetMedicalDataHistory(ctx, patientHash) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientHash);
        let results = await this.GetAllMedicalData(resultsIterator, true);

        return JSON.stringify(results);
    }

    // MedicalDataExists returns true when medical data with given ID exists in world state
    async PatientHashExists(ctx, patientHash) {
        // Check if medical data already exists
        let medicalDataState = await ctx.stub.getState(patientHash);
        return medicalDataState && medicalDataState.length > 0;
    }

    async GetAllMedicalData(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while(!res.done) {
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
