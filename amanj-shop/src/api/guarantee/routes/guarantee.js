'use strict';

/**
 * guarantee router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::guarantee.guarantee');
