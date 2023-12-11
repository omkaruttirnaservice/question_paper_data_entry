import { BIGINT, STRING } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import subject from './subject.js';

const topic = sequelize.define(
    'topic',
    {
        id: {
            type: BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        subject_id: {
            type: BIGINT,
            allowNull: false,
            // references: 'subject',
            // referencesKey: 'id',
        },
        topic_name: {
            type: STRING(255),
            allowNull: false,
        },
    },
    {
        createdAt: false,
        modifiedAt: false,
    }
);

export default topic;
