import db from '../config/db.connect.js';
const subjectModel = {
	getSubjectList: function () {
		return db.query(`
			SELECT 
				sub.id id, 
				subject_name, 
				count(que.id) que_count
			FROM subject sub
			LEFT JOIN question que
			ON sub.id = que.subject_id
			GROUP BY sub.id;	
			`);
	},

	addSubject: function (subjectName) {
		console.log('subject name in modal', subjectName);
		return db.query(
			`INSERT INTO subject (subject_name) VALUES(?)`,
			subjectName
		);
	},

	postEditSubjectName: function (newSubjectName, subjectId) {
		return db.query(`UPDATE subject SET subject_name = ? WHERE id = ?`, [
			newSubjectName,
			subjectId,
		]);
	},

	deleteSubject: function (subjectId) {
		return db.query('DELETE FROM subject WHERE id = ?', subjectId);
	},

	getTopicList: function (subjectId) {
		return db.query(
			`SELECT id,topic_name FROM topic WHERE subject_id = ?`,
			subjectId
		);
	},

	addTopic: function (data) {
		return db.query(`INSERT INTO topic (subject_id, topic_name) VALUES(?, ?)`, [
			data.subjectId,
			data.topicName,
		]);
	},
};

export default subjectModel;
