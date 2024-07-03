import db from '../config/db.connect.js';
const subjectModel = {
	getSubjectList: function (post_id) {
		return db.query(
			`
			SELECT 
				* 
			FROM
				tm_main_topic_list sub
			WHERE
				mtl_master_test_list_id = ?
			`,
			[post_id]
		);
		// return db.query(`
		// 	SELECT
		// 		sub.id id,
		// 		subject_name,
		// 		count(que.id) que_count
		// 	FROM subject sub
		// 	LEFT JOIN question que
		// 	ON sub.id = que.subject_id
		// 	GROUP BY sub.id;
		// 	`);
	},

	addSubject: function (d) {
		return db.query(
			`INSERT INTO tm_main_topic_list (
				mtl_master_test_list_id,
				mtl_name,
				mtp_added_aouth_id,
				mtl_added_time,
				mtl_added_date,
				mtl_time_stamp,
				mtl_is_live,
				type
			) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				d.mtl_master_test_list_id,
				d.mtl_name,
				d.mtp_added_aouth_id,
				d.mtl_added_time,
				d.mtl_added_date,
				d.mtl_time_stamp,
				d.mtl_is_live,
				d.type,
			]
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
			`SELECT id, stl_name AS topic_name FROM tm_sub_topic_list WHERE stl_main_topic_list_id = ?`,
			subjectId
		);
	},

	addTopic: function (d) {
		return db.query(
			`INSERT INTO 
				tm_sub_topic_list (
						stl_name,
						stl_master_test_id,
						stl_main_topic_list_id,
						stl_added_date,
						stl_added_time,
						stl_time_stamp
						) 
				VALUES(?, ?, ?, ?, ?, ?)`,
			[
				d.stl_name,
				d.stl_master_test_id,
				d.stl_main_topic_list_id,
				d.stl_added_date,
				d.stl_added_time,
				d.stl_time_stamp,
			]
		);
	},
};

export default subjectModel;
