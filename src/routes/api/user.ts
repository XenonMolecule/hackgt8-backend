import express from 'express';
import * as userController from '../../controllers/userController';
import {checkJwt, extractToken} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.get('/', checkJwt, extractToken, userController.getUser);
router.post('/', checkJwt, extractToken, userController.postUser);
router.put('/', checkJwt, extractToken, userController.putUser);
router.delete('/', checkJwt, extractToken, userController.deleteUser);
export default router;
