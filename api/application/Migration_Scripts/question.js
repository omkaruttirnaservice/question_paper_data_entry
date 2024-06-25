import { INTEGER, BIGINT, STRING, DATEONLY } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const question = sequelize.define('question', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	question_content: {
		type: STRING,
		allowNull: false,
	},

	option_A: {
		type: STRING,
		allowNull: false,
	},
	option_B: {
		type: STRING,
		allowNull: false,
	},
	option_C: {
		type: STRING,
		allowNull: false,
	},
	option_D: {
		type: STRING,
		allowNull: false,
	},
	option_E: {
		type: STRING,
		defaultValue: '0',
	},

	correct_option: {
		type: STRING,
		allowNull: false,
	},

	explanation: {
		type: STRING,
		defaultValue: '',
	},

	subject_id: {
		type: BIGINT,
		allowNull: false,
	},

	topic_id: {
		type: BIGINT,
		allowNull: false,
	},
	pub_name: {
		type: STRING(200),
		defaultValue: '0',
	},
	pg_no: {
		type: INTEGER,
		defaultValue: '0',
	},
});

export default question;
