/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate medical data state values
const mdState = {
    TRAINING: 1,
    TRAINED: 2,
};


/**
 * MedicalData class extends State class
 * Class will be used by application and smart contract to define a medicalData
 */
class MedicalData extends State {

    // MedicalData 에는
    // patientHash: 환자 개인 정보 해시, enrollNumber: 환자 등록 넘버
    // doctor: 진단 의사 (의사 업로드 아니면 unknown), enrollDateTime: 등록 시간
    // rawImgCID: 원본 이미지 CID, resultImgCID: 결과 이미지 CID
    constructor(obj) {
        super(MedicalData.getClass(), [obj.patientHash, obj.enrollNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
     */
    getPatientHash() {
        return this.patientHash;
    }

    setPatientHash(newPatientHash) {
        this.patientHash = newPatientHash;
    }

    getEnrollNumber() {
        return this.enrollNumber;
    }

    setEnrollNumber(newEnrollNumber) {
        this.enrollNumber = newEnrollNumber;
    }

    getDoctor() {
        return this.doctor;
    }

    setDoctor(newDoctor) {
        this.doctor = newDoctor;
    }

    getEnrollDateTime() {
        return this.enrollDateTime;
    }

    setEnrollDateTime(newEnrollDateTime) {
        this.enrollDateTime = newEnrollDateTime;
    }

    getRawImgCid() {
        return this.rawImgCid;
    }

    setRawImgCid(newRawImgCid) {
        this.rawImgCid = newRawImgCid;
    }

    getResultImgCid() {
        return this.resultImgCid;
    }

    setResultImgCid(newResultImgCid) {
        this.resultImgCid = newResultImgCid;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setTraining() {
        this.currentState = mdState.TRAINING;
    }

    setTrained() {
        this.currentState = mdState.TRAINED;
    }

    isTraining() {
        return this.currentState === mdState.TRAINING;
    }

    isTrained() {
        return this.currentState === mdState.TRAINED;
    }

    static fromBuffer(buffer) {
        return MedicalData.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to medical data
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, MedicalData);
    }

    /**
     * Factory method to create a Medical data
     */
    static createInstance(patientHash, enrollNumber, doctor, enrollDateTime, rawImgCid, resultImgCid) {
        return new MedicalData({ patientHash, enrollNumber, doctor, enrollDateTime, rawImgCid, resultImgCid });
    }

    static getClass() {
        return 'org.medichainnet.medicaldata';
    }
}

module.exports = MedicalData;
