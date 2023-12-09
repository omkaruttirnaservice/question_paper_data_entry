import express from 'express';
import subjectController from '../application/controllers/subjectController.js';
const router = express.Router();

router.get('/get-subject-list', subjectController.getSubjectList);
router.post('/add-subject', subjectController.addSubject);

export default router;
