import sequelize from '../application/config/db-connect-migration.js';
import subject from '../application/Migration_Scripts/subject.js';
import topic from '../application/Migration_Scripts/topic.js';
import question from '../application/Migration_Scripts/question.js';

const getSync = () => {
    sequelize
        .sync({ alter: true })
        .then(() => {
            console.log(
                '"\x1b[47m", \x1b[30m%s\x1b[0m',
                'Database has been migrated successfully, you can now start the server.'
            );
        })
        .catch((error) => console.log(error));
};

export default getSync;
