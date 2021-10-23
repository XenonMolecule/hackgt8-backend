import express from 'express';

import userRoute from './user';
import foodRoute from './food';
import detectRoute from './detect';

const router = express.Router();

router.use('/user', userRoute);
router.use('/food', foodRoute);
router.use('/detect', detectRoute);

export default router;
