import express from 'express';
import questionController from '../application/controllers/questionController.js';

const router = express.Router();

router.post('/add-question', questionController.addNewQuestion);

router.post('/get-question-list', questionController.getQuestionList);

router.get('/get-question-number', questionController.getQuestionNumber);

router.post('/delete', questionController.deleteQuestion)

router.get('/get-question-details', questionController.getQuestionDetails)

export default router;
