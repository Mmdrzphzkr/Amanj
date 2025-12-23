'use strict';

/**
 * payment-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-setting.payment-setting');
