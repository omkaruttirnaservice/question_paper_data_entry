module.exports = {
    apps: [
        {
            name: 'de.api',
            script: 'app.js',

            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',
            env: {},
            env_production: {},
        },
    ],
};
