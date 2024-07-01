import subjectModel from '../model/subjectModel.js';
import { sendSuccess, sendError } from '../utils/commonFunctions.js';
const subjectController = {
	getSubjectList: async (req, res) => {
		try {
			let { post_id } = req.body;
			if (!post_id) {
				throw new Error('Please send post id');
			}
			const [response] = await subjectModel.getSubjectList(post_id);
			sendSuccess(res, response);
		} catch (error) {
			sendError(res, error);
		}
	},
	addSubject: async (req, res) => {
		try {
			const { postId, subjectName } = req.body;

			let insertData = {
				mtl_master_test_list_id: postId,
				mtl_name: subjectName,
				mtp_added_aouth_id: 1,
				mtl_added_time: '00:00:00',
				mtl_added_date: new Date(),
				mtl_time_stamp: '',
				mtl_is_live: 1,
				type: 1,
			};

			const response = await subjectModel.addSubject(insertData);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			} else {
				throw new Error('Data not inserted');
			}
		} catch (error) {
			sendError(res, error);
		}
	},

	postEditSubjectName: async (req, res) => {
		try {
			const { newSubjectName, subjectId } = req.body;
			const response = await subjectModel.postEditSubjectName(
				newSubjectName,
				subjectId
			);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			}
		} catch (error) {
			sendError(res, error);
		}
	},

	deleteSubject: async function (req, res) {
		try {
			const { subjectId } = req.body;
			const response = await subjectModel.deleteSubject(subjectId);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			}
		} catch (error) {
			sendError(res, error);
		}
	},

	getTopicList: async function (req, res) {
		try {
			const subjectId = req.body.subjectId;
			const response = await subjectModel.getTopicList(subjectId);
			sendSuccess(res, response[0]);
		} catch (error) {
			sendError(res, error);
		}
	},

	addTopic: async function (req, res) {
		try {
			const data = req.body;
			const response = await subjectModel.addTopic(data);
			sendSuccess(res, response[0]);
		} catch (error) {
			sendError(res, error);
		}
	},
};

export default subjectController;
