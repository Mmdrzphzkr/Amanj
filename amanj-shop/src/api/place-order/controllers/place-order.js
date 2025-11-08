'use strict';

/**
 * place-order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::place-order.place-order');
