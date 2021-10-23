import express from 'express';

import userRoute from './user';
import foodRoute from './food';

const router = express.Router();

router.use('/user', userRoute);
router.use('/food', foodRoute);

export default router;
