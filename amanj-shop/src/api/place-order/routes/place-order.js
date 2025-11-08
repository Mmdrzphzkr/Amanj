'use strict';

/**
 * place-order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::place-order.place-order');
