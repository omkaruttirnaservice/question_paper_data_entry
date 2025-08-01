import express from 'express';
import subjectController from '../application/controllers/subjectController.js';
const router = express.Router();

router.post('/list', subjectController.getTopicList);
router.post('/add-topic', subjectController.addTopic);

export default router;
