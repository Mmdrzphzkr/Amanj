'use strict';

/**
 * place-order service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::place-order.place-order');
