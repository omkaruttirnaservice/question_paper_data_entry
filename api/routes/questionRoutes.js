import express from "express";
import questionController from "../application/controllers/questionController.js";

const router = express.Router();

router.post('/add-question', questionController.addNewQuestion);

router.get('/get-question-list', questionController.getQuestionList)

export default router;

