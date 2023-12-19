import questionModel from '../model/questionModel.js';
import customValidate from '../utils/customValidate.js';

const { isNonEmptyNullString, isNumber } = customValidate;
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const questionController = {
    addNewQuestion: async (req, res) => {
        try {
            const {
                question_content,
                option_A,
                option_B,
                option_C,
                option_D,
                option_E,
                correct_option,
                explanation,
                subject_id,
                topic_id,
            } = req.body;
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

            if (response[0].affectedRows === 0) throw new Error('Question was not saved');
            sendSuccess(res);
        } catch (err) {
            sendError(res, err);
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const questionId = req.body.questionId;
            if (isNumber(questionId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Empty question id',
                });
            }
            // const existingQuestion = await questionModel.getQuestion(questionId);

            // if (!existingQuestion) {
            //     return res.status(404).json({
            //         success: 0,
            //         message: 'Question not found',
            //     });
            // }

            await questionModel.deleteQuestion(questionId);
            sendSuccess(res);
        } catch (err) {
            sendError(res, err);
        }
    },

    getQuestionNumber: async (req, res) => {
        try {
            console.log('getting question number');
            let response = await questionModel.getQuestionNumber();
            console.log(response[0], 'question number');
            if (response[0].length !== 0) {
                sendSuccess(res, response[0][0]);
            }
        } catch (error) {
            sendError(res, error);
        }
    },

    getQuestionList: async (req, res) => {
        try {
            const { subjectId, topicId } = req.body;

            const questionList = await questionModel.getQuestionList(+subjectId, +topicId);

            console.log(questionList[0]);
            sendSuccess(res, questionList[0]);
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
