import express from 'express';
import * as recipeController from '../../controllers/recipeController';
import {checkJwt, extractToken} from "../../util/auth";

const router = express.Router();
/*
* Code routes here for CRUD on users
*/

router.get('/', checkJwt, extractToken, recipeController.getRecipes);

export default router;
