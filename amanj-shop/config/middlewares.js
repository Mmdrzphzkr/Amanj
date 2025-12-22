module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        // "https://amanjcoffee.com",
        // "https://www.amanjcoffee.com",
        // "https://api.amanjcoffee.com",
        "http://localhost:3000",
        "http://localhost:8000"
      ],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', '*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
      keepHeadersOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
