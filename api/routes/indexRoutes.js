import express from 'express';
import subjectRoutes from './subjectRoutes.js';

const router = express.Router();

router.use('/', subjectRoutes);

export default router;
