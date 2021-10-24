import express from 'express';

import userRoute from './user';
import foodRoute from './food';
import detectRoute from './detect';
import recipeRoute from './recipes';

const router = express.Router();

router.use('/user', userRoute);
router.use('/food', foodRoute);
router.use('/detect', detectRoute);
router.use('/recipes', recipeRoute);

export default router;
