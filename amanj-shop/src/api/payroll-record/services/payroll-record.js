'use strict';

/**
 * payroll-record service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payroll-record.payroll-record');
