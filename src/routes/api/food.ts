import express from 'express';

import * as foodController from '../../controllers/foodController';
import {checkJwt} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.get('/', foodController.getFood);
router.post('/', checkJwt, foodController.postFood);
router.put('/', checkJwt, foodController.putFood);
router.delete('/', checkJwt, foodController.deleteFood);
export default router;
