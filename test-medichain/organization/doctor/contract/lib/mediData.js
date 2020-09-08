/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const MedicalState = require('./../ledger-api/mediState.js');

/**
 * MedicalData class extends State class
 * Class will be used by application and smart contract to define a medicalData
 */
class MedicalData extends MedicalState {

    // MedicalData 에는
    // doctor: 진단 의사 (의사 업로드 아니면 unknown), patientHash: 환자 개인 정보 해시,
    // rawImgCID: 원본 이미지 CID, resultImgCID: 결과 이미지 CID
    // timestamp: 시간 (UTC 기준)
    constructor(obj) {
        super(MedicalData.getClass(), [obj.patientHash]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
     */
    getDoctor() {
        return this.doctor;
    }

    setDoctor(newDoctor) {
        this.doctor = newDoctor;
    }

    getPatientHash() {
        return this.patientHash;
    }

    setPatientHash(newPatientHash) {
        this.patientHash = newPatientHash;
    }

    getRawImgCID() {
        return this.rawImgCID;
    }

    getEnrollDateTime() {
        return this.enrollDateTime;
    }

    setEnrollDateTime(newEnrollDateTime) {
        this.enrollDateTime = newEnrollDateTime;
    }

    setRawImgCID(newRawImgCID) {
        this.rawImgCID = newRawImgCID;
    }

    getResultImgCID() {
        return this.resultImgCID;
    }

    setResultImgCID(newResultImgCID) {
        this.resultImgCID = newResultImgCID;
    }

    static fromBuffer(buffer) {
        return MedicalData.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return MedicalState.deserializeClass(data, MedicalData);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(doctor, patientHash, enrollDateTime, rawImgCID, resultImgCID) {
        return new MedicalData({ doctor, patientHash, enrollDateTime, rawImgCID, resultImgCID });
    }

    static getClass() {
        return 'org.medichainnet.medicalData';
    }
}

module.exports = MedicalData;
