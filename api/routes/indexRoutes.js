import express from 'express';
import subjectRoutes from './subjectRoutes.js';
import questionRoutes from './questionRoutes.js';

const router = express.Router();

router.use('/', subjectRoutes);

router.use('/questions', questionRoutes);

export default router;
