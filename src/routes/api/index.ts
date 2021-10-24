import express from 'express';

import userRoute from './user';
import inventoryRoute from './inventory';
import detectRoute from './detect';
import recipeRoute from './recipes';

const router = express.Router();

router.use('/user', userRoute);
router.use('/inventory', inventoryRoute);
router.use('/detect', detectRoute);
router.use('/recipes', recipeRoute);

export default router;
