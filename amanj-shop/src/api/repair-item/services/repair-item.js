'use strict';

/**
 * repair-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::repair-item.repair-item');
