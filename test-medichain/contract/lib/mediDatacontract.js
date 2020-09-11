/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// Medichain Net specific classes
const MedicalData = require('./mediData.js');
const MedicalDataList = require('./mediDatalist.js');

/**
 * A custom context provides easy access to list of all medicalData
 */
class MedicalDataContext extends Context {
    constructor() {
        super();
        // All medicalData are held in a list of medicalDataList
        this.medicalDataList = new MedicalDataList(this);
    }
}

/**
 * Define medical data smart contract by extending Fabric Contract class
 */
class MedicalDataContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.medichainnet.medicaldata');
    }

    /**
     * Define a custom context for medical data
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
     * @param {String} patientHash 해시화된 환자 정보
     * @param {Integer} enrollNumber
     * @param {String} doctor enroll doctor
     * @param {String} enrollDateTime Date time when enroll data
     * @param {String} rawImg rawImg
     * @param {String} resultImg Result Image
     */
    async upload(ctx, patientHash, enrollNumber, doctor, enrollDateTime, rawImg, resultImg) {

        // create an instance of the medicalData
        let medicalData = MedicalData.createInstance(doctor, patientHash, enrollDateTime, rawImg, resultImg);

        // moves medical data into TRAINING state
        medicalData.setTraining();

        // Newly uploaded medical data is owned by the patient
        medicalData.setOwner(patientHash);

        // Add the medical data to the list of all similar medical datas in the ledger world state
        await ctx.medicalDataList.addMedicalData(medicalData);

        // Must return a serialized medicalData to caller of smart contract
        return medicalData;
    }

    /**
     * query medical data
     *
     * @param {Context} ctx the transaction context
     * @param {String} patientHash 해시화된 환자 정보
     * @param {Integer} enrollNumber 등록 번호
     * @param {String} currentPatientHash 현재 해시화된 환자 정보
     */
    async query(ctx, patientHash, enrollNumber, currentPatientHash) {
        // using key fields
        let medicalDataKey = MedicalData.makeKey([patientHash, enrollNumber]);
        let medicalData = await ctx.medicalDataList.getMedicalData(medicalDataKey);

        if (medicalData.getOwner() !== currentPatientHash) {
            throw new Error('Medical Data ' + patientHash + enrollNumber + ' is not owned by ' + currentPatientHash);
        }

        return medicalData;
    }

    /**
     * training medical data
     *
     * @param {Context} ctx the transaction context
     */
    async training(ctx) {
        // Need Update State
    }
}

module.exports = MedicalDataContract;
