import db from '../config/db.connect.js';
const questionModel = {
	addNewQuestion: (data) => {
		console.log(data, 'save question data.');
		return db.query(
			`INSERT INTO question 
                        (question_content,
                        option_A,
                        option_B,
                        option_C,
                        option_D,
                        option_E,
                        correct_option,
                        explanation,
                        subject_id,     
                        topic_id, 
                        pub_name, 
                        pg_no
                        )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
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
				data.pub_name,
				data.pg_no,
			]
		);
	},

	deleteQuestion: (id) => {
		console.log(id, 'delete que id');
		const q = `DELETE FROM question WHERE id = ?`;
		return db.query(q, [id]);
	},

	getQuestion: (id) => {
		const q = `SELECT * FROM question WHERE id = ?`;
		return db.query(q, [id]);
	},

	getEditQuestionData: (id) => {
		const q = `
                    SELECT
                        q.*,
                        s.*,
                        t.*
                        FROM
                        question q
                        JOIN
                        subject s ON q.subject_id = s.id
                        JOIN
                        topic t ON q.topic_id = t.id
                        WHERE
                        q.id = ?;
                    `;
		return db.query(q, [id]);
	},

	editQuestion: (data) => {
		const q = `UPDATE question SET 
                question_content = ?,
                option_A = ?,
                option_B = ?,
                option_C = ?,
                option_D = ?,
                option_E = ?,
                correct_option = ?,
                explanation = ?,
                pub_name = ?,
                pg_no = ?
            WHERE id = ?`;
		return db.query(q, [
			data.question_content,
			data.option_A,
			data.option_B,
			data.option_C,
			data.option_D,
			data.option_E,
			data.correct_option,
			data.explanation,
			data.pub_name,
			data.pg_no,
			data.id,
		]);
	},

	getQuestionNumber: () => {
		return db.query(`SELECT COUNT(id) AS total_questions FROM question;`);
	},

	getQuestionList: (subjectId, topicId) => {
		const q = `SELECT 
                        question.id, 
                        question_content,
                        option_A,
                        option_B,
                        option_C,
                        option_D,
                        option_E,
                        correct_option,
                        explanation, 
                        subject_name, 
                        topic_name,
                        pub_name,
                        pg_no
                    FROM question 
                    
                    INNER JOIN subject as sub ON 
                    question.subject_id = sub.id 
                    INNER JOIN topic ON 
                    question.topic_id = topic.id
                    WHERE question.subject_id = ? AND question.topic_id = ?`;

		return db.query(q, [subjectId, topicId]);
	},
};

export default questionModel;
