import express from 'express';
import questionController from '../application/controllers/questionController.js';

const router = express.Router();

router.post('/add-question', questionController.addNewQuestion);

router.post('/get-question-list', questionController.getQuestionList);

router.get('/get-question-number', questionController.getQuestionNumber);

router.post('/delete', questionController.deleteQuestion);

router.put('/edit-question', questionController.editQuestion);

router.post('/edit-question-data', questionController.editQuestionData);

router.get('/publications-list', questionController.getPublicationList);

router.post('/books-list', questionController.getBooksList);

export default router;
