import db from '../config/db.connect.js';
const postModel = {
	getPostList: () => {
		return db.query(`SELECT * FROM tm_master_test_list;`);
	},

	addPost: (d) => {
		return db.query(
			`INSERT INTO 
				tm_master_test_list (
					mtl_test_name,
					mtl_long_form,
					mtl_test_desc,
					added_time,
					added_date,
					added_time_stamp,
					mtl_is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				d.mtl_test_name,
				d.mtl_long_form,
				d.mtl_test_desc,
				d.added_time,
				d.added_date,
				d.added_time_stamp,
				d.mtl_is_active,
			]
		);
	},
};

export default postModel;
