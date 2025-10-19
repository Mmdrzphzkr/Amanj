'use strict';

/**
 * public-gallery service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::public-gallery.public-gallery');
