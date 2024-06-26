import questionModel from '../model/questionModel.js';
import customValidate from '../utils/customValidate.js';

const { isNonEmptyNullString, isNumber } = customValidate;
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const questionController = {
	addNewQuestion: async (req, res) => {
		try {
			// const {
			//     question_content,
			//     option_A,
			//     option_B,
			//     option_C,
			//     option_D,
			//     option_E,
			//     correct_option,
			//     explanation,
			//     subject_id,
			//     topic_id,
			// } = req.body;
			// if (
			//     !isNonEmptyNullString(question_content) ||
			//     !isNonEmptyNullString(option_A) ||
			//     !isNonEmptyNullString(option_B) ||
			//     !isNonEmptyNullString(option_C) ||
			//     !isNonEmptyNullString(option_D) ||
			//     !isNonEmptyNullString(correct_option) ||
			//     !isNumber(subject_id) ||
			//     !isNumber(topic_id)
			// ) {
			//     return res.status(400).json({
			//         success: 0,
			//         message: `Bad Request. All fields are required`,
			//     });
			// }

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
		} catch (error) {
			return sendError(res, error);
		}
	},

	getQuestionDetails: async (req, res) => {
		try {
			const { questionId } = req.query;
			if (isNumber(questionId)) {
				return res.status(400).json({
					success: false,
					message: 'Empty question id',
				});
			}
			const response = await questionModel.getQuestionDetails(questionId);
			return sendSuccess(res, response[0][0]);
		} catch (err) {
			return sendError(res, err);
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
			const { subjectId, topicId } = req.body;
			const questionList = await questionModel.getQuestionList(
				+subjectId,
				+topicId
			);
			return sendSuccess(res, questionList[0]);
		} catch (err) {
			console.log('Error whlie fetching the questions: ', err);
			return res.status(500).json({
				success: 0,
				message: 'Internal server error',
				error: `ERROR : ${err}`,
			});
		}
	},
};

export default questionController;
