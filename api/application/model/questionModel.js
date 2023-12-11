import db from '../config/db.connect.js';

const questionModel = {
    addNewQuestion: (data) => {
        const q = `INSERT INTO question 
            (question_content, option_A, option_B, option_C, 
            option_D, option_E, correct_option, explanation, 
            subject_id, topic_id)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        return db.query(q, [
            data.question_content,
            data.option_A,
            data.option_B,
            data.option_C,
            data.option_D,
            data.option_E,
            data.correct_option,
            data.explanation,
            data.subject_id,
            data.topic_id,
        ]);
    },

    deleteQuestion: (id) => {
        const q = `DELETE FROM question WHERE id = ?`;
        return db.query(q, [id]);
    },

    getQuestion: (id) => {
        const q = `SELECT * FROM question WHERE id = ?`;
        return db.query(q, [id]);
    },

    getQuestionList: ({ subject_id, topic_id }) => {
        const q = `SELECT * FROM question WHERE subject_id = ? AND topic_id = ?`;
        return db.query(q, [subject_id, topic_id]);
    },
};

export default questionModel;
