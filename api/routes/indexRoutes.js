import express from 'express';

import questionRoutes from './questionRoutes.js';
import subjectRoutes from './subjectRoutes.js';
const router = express.Router();

router.use('/', subjectRoutes);
router.use('/questions', questionRoutes);

export default router;
