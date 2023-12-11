import questionModel from '../model/questionModel.js';
import customValidate from '../utils/customValidate.js';

const { isNonEmptyNullString, isNumber } = customValidate;

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

            if (
                !isNonEmptyNullString(question_content) ||
                !isNonEmptyNullString(option_A) ||
                !isNonEmptyNullString(option_B) ||
                !isNonEmptyNullString(option_C) ||
                !isNonEmptyNullString(option_D) ||
                !isNonEmptyNullString(correct_option) ||
                !isNumber(subject_id) ||
                !isNumber(topic_id)
            ) {
                return res.status(400).json({
                    success: 0,
                    message: `Bad Request. All fields are required`,
                });
            }

            const questionData = {
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
            };

            await questionModel.addNewQuestion(questionData);

            return res.status(200).json({
                success: 1,
                message: 'New question added successfully',
            });
        } catch (err) {
            console.log('Error while adding the new question : ', err);
            return res.status(500).json({
                success: 0,
                message: 'Internal server error',
                error: `Error: ${err}`,
            });
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.query;
            if (isNumber(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Empty question id',
                });
            }
            const existingQuestion = await questionModel.getQuestion(id);

            if (!existingQuestion) {
                return res.status(404).json({
                    success: 0,
                    message: 'Question not found',
                });
            }

            await questionModel.deleteQuestion(id);

            return res.status(200).json({
                success: 1,
                message: `Question deleted successfully`,
            });
<<<<<<< HEAD
            
        } catch (err) {
            sendError(res, err);
=======
        } catch (err) {
            console.log();
>>>>>>> main
        }
    },

    getQuestionList: async (req, res) => {
        try {
            const { subject_id, topic_id } = req.body;

            if (!isNumber(subject_id) || !isNumber(topic_id)) {
                return res.status(400).json({
                    success: 0,
                    message: `Bad Request. All fields are required`,
                });
            }

            const questionList = await questionModel.getQuestionList({ subject_id, topic_id });
<<<<<<< HEAD
            sendSuccess(res, questionList[0]);
        } catch (err) {
=======

            return res.status(200).json({
                success: 1,
                message: `Questions sent successfullly`,
                questionList: questionList[0],
            });
        } catch (err) {
            console.log('Error whlie fetching the questions: ', err);
>>>>>>> main
            return res.status(500).json({
                success: 0,
                message: 'Internal server error',
                error: `ERROR : ${err}`,
            });
        }
    },
};

export default questionController;
