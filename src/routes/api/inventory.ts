import express from 'express';
import * as inventoryController from '../../controllers/inventoryController';
import {checkJwt, extractToken} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.post('/', checkJwt, extractToken, inventoryController.postFood);
router.put('/', checkJwt, extractToken, inventoryController.putFood);
router.delete('/', checkJwt, extractToken, inventoryController.deleteFood);

export default router;
