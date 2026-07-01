'use strict';

/**
 * guarantee service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::guarantee.guarantee');
