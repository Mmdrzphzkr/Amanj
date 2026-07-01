'use strict';

/**
 * guarantee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::guarantee.guarantee');
