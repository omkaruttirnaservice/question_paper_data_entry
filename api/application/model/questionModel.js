import db from '../config/db.connect.js';
import { myDate } from '../config/utils.js';
const questionModel = {
	addNewQuestion: (data) => {
		console.log(data, 'save question data.');
		return db.query(
			`INSERT INTO tm_mega_question_set 
                        (mqs_question, 
                        mqs_opt_one, 
                        mqs_opt_two, 
                        mqs_opt_three, 
                        mqs_opt_four, 
                        mqs_opt_five,
                        mqs_type,
                        mqs_ans,
                        mqs_solution, 
                        mqs_leval, 
                        mqs_added_by, 
                        mqs_section_id, 
                        mqs_chapter_id, 
                        mqs_added_date, 
                        mqs_added_time, 
                        mqs_added_time_stamp, 
                        mqs_is_trash, 
                        msq_publication_name, 
                        msq_book_name, 
                        maq_page_number, 
                        mqs_ask_in_month, 
                        mqs_ask_in_year
                        )
                    VALUES
                    ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.question_content,
				data.option_A,
				data.option_B,
				data.option_C,
				data.option_D,
				data.option_E,
				'1', // hard coding value to 1 because of mcq question type
				data.correct_option,
				data.explanation,
				data.difficulty,
				'1', // hard coding to 1 because of added by admin
				data.subject_id,
				data.topic_id,
				myDate.getDate(),
				myDate.getTime(),
				myDate.getTimeStamp(),
				'0', // hard coding to 1 becuase question is not trash
				data.pub_name,
				data.book_name,
				data.pg_no,
				data.month,
				data.year,
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

	getQuestionList: (d) => {
		console.log(d, 'in model');
		const q = `SELECT 
                        *
                    FROM tm_mega_question_set AS mqs
                    WHERE 
                        mqs.mqs_section_id = ? AND mqs.mqs_chapter_id = ?`;

		return db.query(q, [+d.subject_id, +d.topic_id]);
	},

	getPublicationList: async () => {
		return db.query(
			`SELECT 
                msq_publication_name
            FROM 
                tm_mega_question_set 
            WHERE
                coalesce(msq_publication_name, '') != ''
            GROUP BY msq_publication_name`
		);
	},

	getBooksList: async (pubName) => {
		return db.query(
			`SELECT 
                msq_book_name
            FROM 
                tm_mega_question_set 
            WHERE
                msq_publication_name = ?
            GROUP BY msq_book_name`,
			[pubName]
		);
	},
};

export default questionModel;
