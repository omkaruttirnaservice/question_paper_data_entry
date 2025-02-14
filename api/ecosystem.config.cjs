module.exports = {
	apps: [
		{
			name: 'QP-data-entry-API',
			script: 'app.js',

			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '2G',
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
