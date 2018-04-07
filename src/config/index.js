const DOMAIN_MAP = {
    development: process.env.MOCK
        ? `http://localhost:${process.env.PORT}/mocks`
        : 'http://beta.example.com',
    beta: 'http://beta.example.com',
    production: 'https://api.example.com'
};

export default {
    VERSION: '1.0.0',
    APP_NAME: 'sample-mpvue-wxapp',
    MOCK: process.env.MOCK === true,
    DEBUG: process.env.NODE_ENV !== 'production',
    DOMAIN:
        DOMAIN_MAP[process.env.NODE_ENV || 'production'] ||
        'https://api.example.com'
};
