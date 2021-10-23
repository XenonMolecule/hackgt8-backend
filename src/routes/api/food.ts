import express from 'express';
import * as foodController from '../../controllers/foodController';
import {checkJwt, extractToken} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.post('/', checkJwt, extractToken, foodController.postFood);
router.put('/', checkJwt, extractToken, foodController.putFood);
router.delete('/', checkJwt, extractToken, foodController.deleteFood);

export default router;
