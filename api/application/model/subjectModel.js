import db from '../config/db.connect.js';
const subjectModel = {
    getSubjectList: function () {
        return db.query('SELECT subject_name FROM subject');
    },

    addSubject: function (subjectName) {
        console.log(subjectName, 'in model');
        return db.query(`INSERT INTO subject (subject_name, updatedAt) VALUES(?, ?)`, [
            subjectName,
            new Date(),
        ]);
    },
};

export default subjectModel;
