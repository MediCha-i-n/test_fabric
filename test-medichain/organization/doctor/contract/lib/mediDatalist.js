/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const MedicalStateList = require('./../ledger-api/mediStatelist.js');

const MedicalData = require('./mediData.js');

class MedicalDatalist extends MedicalStateList {

    constructor(ctx) {
        super(ctx, 'org.medichainnet.medicalData');
        this.use(MedicalData);
    }

    async addMedicalData(medicalData) {
        return this.addState(medicalData);
    }

    async getMedicalData(medicalKey) {
        return this.getState(medicalKey);
    }
}


module.exports = MedicalDatalist;
