import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.HOST,
		dialect: 'mysql',
		loggin: false,
		define: {
			freezeTableName: true,
		},
		timezone: '+05:30',
	}
);

export default sequelize;
