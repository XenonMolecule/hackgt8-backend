import express from 'express';
import * as detectController from '../../controllers/detectController';
import {checkJwt} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.post('/food', checkJwt, detectController.postFood);

export default router;
