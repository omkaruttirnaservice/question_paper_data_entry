import { BIGINT, STRING } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const subject = sequelize.define(
    'subject',
    {
        id: {
            type: BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        subject_name: {
            type: STRING,
            allowNull: false,
        },
    },
    {
        createdAt: false,
        modifiedAt: false,
    }
);

export default subject;