import express from 'express';

import questionRoutes from './questionRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import topicRoutes from './topicRouter.js';
import postsRoutes from './postsRoutes.js';
import authRoutes from './authRouter.js';
import { authenticateJWT } from './authMiddleware.js';

const router = express.Router();

router.use('/subject', authenticateJWT, subjectRoutes);
router.use('/topic', authenticateJWT, topicRoutes);
router.use('/questions', authenticateJWT, questionRoutes);

router.use('/posts', authenticateJWT, postsRoutes);
router.use('/auth', authRoutes);

export default router;
