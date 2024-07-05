import questionModel from '../model/questionModel.js';
import customValidate from '../utils/customValidate.js';

const { isNonEmptyNullString, isNumber } = customValidate;
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const questionController = {
	addNewQuestion: async (req, res) => {
		try {
			let response = await questionModel.addNewQuestion(req.body);
			if (response[0].affectedRows === 0)
				throw new Error('Question was not saved');
			return sendSuccess(res);
		} catch (err) {
			return sendError(res, err);
		}
	},

	deleteQuestion: async (req, res) => {
		console.log(req.body, '---');
		try {
			const questionId = +req.body.questionId;
			// if (isNumber(questionId)) {
			//     return res.status(400).json({
			//         success: false,
			//         message: 'Empty question id',
			//     });
			// }
			const existingQuestion = await questionModel.getQuestion(questionId);

			if (!existingQuestion) {
				return res.status(404).json({
					success: 0,
					message: 'Question not found',
				});
			}

			await questionModel.deleteQuestion(questionId);
			return sendSuccess(res);
		} catch (err) {
			sendError(res, err);
		}
	},

	editQuestion: async (req, res) => {
		try {
			console.log(req.body, '==req.body edit question controller==');
			let _editRes = await questionModel.editQuestion(req.body);
			return sendSuccess(res, _editRes);
		} catch (error) {
			return sendError(res, error);
		}
	},

	editQuestionData: async (req, res) => {
		try {
			let qId = req.body.questionId;
			if (!qId) throw new Error('No question id sent');

			let _data = await questionModel.getEditQuestionData(qId);
			return sendSuccess(res, _data[0]);
		} catch (error) {
			return sendError(res, error);
		}
	},

	getQuestionNumber: async (req, res) => {
		try {
			let response = await questionModel.getQuestionNumber();
			if (response[0].length !== 0) {
				return sendSuccess(res, response[0][0]);
			}
		} catch (err) {
			return sendError(res, err);
		}
	},

	getQuestionList: async (req, res) => {
		try {
			const { post_id, subject_id, topic_id } = req.body;
			const questionList = await questionModel.getQuestionList({
				post_id,
				subject_id,
				topic_id,
			});
			return sendSuccess(res, questionList[0]);
		} catch (err) {
			console.log('Error whlie fetching the questions: ', err);
			return sendError(res, err);
		}
	},

	// publication list

	getPublicationList: async (req, res) => {
		try {
			let [publicationsList] = await questionModel.getPublicationList();
			return sendSuccess(res, publicationsList);
		} catch (error) {
			return sendError(res, err);
		}
	},

	getBooksList: async (req, res) => {
		try {
			let { pubName } = req.body;
			let [booksList] = await questionModel.getBooksList(pubName);
			return sendSuccess(res, booksList);
		} catch (error) {
			console.log(error, '-error');
			return sendError(res, err);
		}
	},
};

export default questionController;
