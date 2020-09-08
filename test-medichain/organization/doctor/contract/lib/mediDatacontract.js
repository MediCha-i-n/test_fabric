/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const MedicalData = require('./mediData.js');
const MedicalDataList = require('./mediDatalist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class MedicalDataContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.medicalDataList = new MedicalDataList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class MedicalDataContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.medichainnet.medicalData');
    }

    /**
     * Define a custom context for commercial paper
     */
    createContext() {
        return new MedicalDataContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * upload medical data
     *
     * @param {Context} ctx the transaction context
     * @param {String} doctor enroll doctor
     * @param {String} patientHash 해시화된 환자 정보
     * @param {Integer} enrollDateTime Date time when enroll data
     * @param {String} dataNumber data number for this patient
     * @param {String} rawImg rawImg
     * @param {Integer} resultImg Result Image
     */
    async upload(ctx, doctor, patientHash, enrollDateTime, dataNumber, rawImg, resultImg) {

        // create an instance of the medicalData
        let medicalData = MedicalData.createInstance(doctor, patientHash, enrollDateTime, dataNumber, rawImg, resultImg);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.medicalDataList.addMedicalData(medicalData);

        // Must return a serialized medicalData to caller of smart contract
        return medicalData;
    }

    /**
     * query medical data
     *
     * @param {Context} ctx the transaction context
     * @param {String} patientHash 해시화된 환자 정보
     */
    async query(ctx, patientHash) {
        // using key fields
        let medicalDataKey = MedicalData.makeKey([patientHash]);
        let medicalData = await ctx.medicalDataList.getMedicalData(medicalDataKey);
        return medicalData;
    }
}

module.exports = MedicalDataContract;
