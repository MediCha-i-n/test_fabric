/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const MedicalData = require('./mediData.js');

class MedicalDatalist extends StateList {

    constructor(ctx) {
        super(ctx, 'org.medichainnet.medicaldata');
        this.use(MedicalData);
    }

    async addMedicalData(medicalData) {
        return this.addState(medicalData);
    }

    async getMedicalData(medicalKey) {
        return this.getState(medicalKey);
    }

    async updateMedicalData(medicalData) {
        return this.updateState(medicalData);
    }
}


module.exports = MedicalDatalist;
