import { Error } from 'mongoose';

import { Response, Request } from 'express';
import { Food, FoodDocument} from '../models/Food';
import {UserFood} from "../models/User/Food";

export const getFoodNameFromInventory = (inventory:UserFood) => {
    return new Promise((resolve, reject) => {
        Food.findById(inventory.foodID).select('name').then((res) => {
            resolve(res.name);
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
 * Gets Food Info for specified id
 * @route GET /api/food?id={foodid}
 */
export const getFood = (req: Request, res: Response) => {
    // req.query.id should hold the id to specify the food
    if (req.query === undefined || req.query === null || req.query.id === undefined) {
        res.status(400).json({ message: 'No id provided', user: {} });
        return;
    }

    // Query the users in the db based on the auth0AccessToken
    Food.findById(req.query.id).then((food) => {
        if (food !== null) {
            res.status(200).json({ message: 'success', food });
        } else {
            res.status(400).json({ message: 'no food with id ' + req.query.id + ' found', food });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message, food: {} });
    })
};

/**
 * Create a new food item
 * @route POST /api/food
 */
export const postFood = (req: Request, res: Response) => {
    // req.body.data should hold the information to create the user
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'No food information provided', user: {} });
        return;
    }

    const newFood = JSON.parse(req.body.data);

    Food.create(newFood, function(err:Error, food:FoodDocument) {
        if (err) {
            res.status(400).json({ message: err.message, food });
            return;
        }
        res.status(200).json({ message: 'success', food });
    });
};

/**
 * Update a food
 * @route PUT /api/food?id={foodid}
 */
export const putFood = (req: Request, res: Response) => {
    // req.query.id should hold the id to specify the food
    if (req.query === undefined || req.query === null || req.query.id === undefined) {
        res.status(400).json({ message: 'No id provided', food: {} });
        return;
    }

    // req.body.data should hold the donationform information to save to the user
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'No food information provided', food: {} });
        return;
    }

    // Query the users in the db based on the auth0AccessToken
    Food.findById(req.query.id).then((food:FoodDocument) => {
        const updatedFood = JSON.parse(req.body.data);

        for (const key in updatedFood) {
            if(updatedFood.hasOwnProperty(key)) {
                food.set(key, updatedFood[key]);
            }
        }

        food.save().then(() => {
            res.status(200).json({ message: 'success', food });
        }).catch((err) => {
            res.status(400).json({ message: err.message, food });
        });
    }).catch((err) => {
        res.status(400).json({ message: err.message, food: {} });
    });
};

/**
 * Delete a food
 * @route DELETE /api/food?id={foodid}
 */
export const deleteFood = (req: Request, res: Response) => {
    // req.query.id should hold the id to specify the food
    if (req.query === undefined || req.query === null || req.query.id === undefined) {
        res.status(400).json({ message: 'No id provided', food: {} });
        return;
    }

    Food.deleteOne({ _id: req.query.id }, (err:Error, deletedInfo:any) => {
        if (err) {
            res.status(400).json({ message: err.message, info: deletedInfo });
            return;
        }
        res.status(200).json({ message: 'success', info: deletedInfo });
    });
};

function escapeRegex(text:string | any) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Search for a food
 * @route GET /api/food/search?name={name}
 */
export const searchFood = (req: Request, res: Response) => {
    // req.query.id should hold the id to specify the food
    if (req.query === undefined || req.query === null || req.query.name === undefined) {
        res.status(400).json({ message: 'No name provided', food: {} });
        return;
    }

    const regex = new RegExp(escapeRegex(req.query.name), 'gi');
    Food.findOne({ "name": regex }, function(err:any, food:FoodDocument) {
        if(err) {
            res.status(400).json({ message: err.message });
            return;
        } else if (food === null) {
            res.status(400).json({ message: 'could not find food with name ' + req.query.name + ' in the db', food });
        } else {
            res.status(200).json({ message: 'success', food });
        }
    });
};
