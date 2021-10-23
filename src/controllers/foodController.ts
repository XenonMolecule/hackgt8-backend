import { Error } from 'mongoose';

import { Response, Request } from 'express';
import { User, UserDocument} from '../models/User';

/**
 * Adds a new food to the current user's inventory
 * @route POST /api/food
 */
export const postFood = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    if (req.body.data === undefined) {
        res.status(400).json({ message: 'No food data provided', user: {} });
        return;
    }

    // Query the users in the db based on the auth0AccessToken
    User.findOne({ auth0AccessToken: accessToken }, (err:Error, user:UserDocument) => {
        // If there was an error report code 400 to the client
        if (err) {
            res.status(400).json({ message: err.message, user });
            return;
        }
        if (user === null) {
            res.status(200).json({ message: 'Could not find user in db', user });
            return;
        }
        // In the future we should implement some sort of check if the exact item is already in the user inventory
        //  and just increment the count of that item, but this would be O(N) for every addition unless some sort of
        //  clever hashing was utilized.
        try {
            const newItem = JSON.parse(req.body.data);
            user.inventory.push(newItem);
            user.save().then((newUser) => {
                res.status(200).json({message:'success', newUser })
            }).catch((err) => {
                res.status(400).json({message: err.message, user});
            });
        } catch (err) {
            res.status(200).json({ message: err.message, user });
        }
    });
};

/**
 * Updates a food in the current user's inventory
 * @route PUT /api/food?id={foodid}
 */
export const putFood = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    // req.body.accessToken should hold the accessToken to specify the user
    if (req.query === undefined || req.query === null || req.query.foodid === undefined) {
        res.status(400).json({ message: 'No foodid provided', user: {} });
        return;
    }
    const foodid = req.query.foodid;

    // Query the users in the db based on the auth0AccessToken
    User.findOne({ auth0AccessToken: accessToken }, (err:Error, user:UserDocument) => {
        // If there was an error report code 400 to the client
        if (err) {
            res.status(400).json({ message: err.message, user });
            return;
        }
        if (user === null) {
            res.status(400).json({ message: 'Could not find user in db', user });
            return;
        }
        // In the future we should implement some sort of check if the exact item is already in the user inventory
        //  and just increment the count of that item, but this would be O(N) for every addition unless some sort of
        //  clever hashing was utilized.
        try {
            const updatedItem = JSON.parse(req.body.data);
            for (let i = 0; i < user.inventory.length; i++) {
                if (user.inventory[i]._id.toString() === foodid) {
                    for (const key in updatedItem) {
                        if (updatedItem.hasOwnProperty(key)) {
                            // @ts-ignore have to update the food item with some sort of indexing and typescript doesn't love it
                            user.inventory[i][key] = updatedItem[key];
                        }
                    }
                    user.save().then((updatedUser) => {
                        res.status(200).json({message:'success', updatedUser })
                    }).catch((err) => {
                        res.status(400).json({message: err.message, user});
                    });
                    return;
                }
            }
            res.status(400).json({message: 'Could not find food with id ' + foodid + ' for current user', user});
        } catch (err) {
            res.status(200).json({ message: err.message, user });
        }
    });
};

/**
 * Deletes a food from the current user's inventory
 * @route DELETE /api/food?id={foodid}
 */
export const deleteFood = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    // req.body.accessToken should hold the accessToken to specify the user
    if (req.query === undefined || req.query === null || req.query.foodid === undefined) {
        res.status(400).json({ message: 'No foodid provided', user: {} });
        return;
    }
    const foodid = req.query.foodid;

    // Query the users in the db based on the auth0AccessToken
    User.findOne({ auth0AccessToken: accessToken }, (err:Error, user:UserDocument) => {
        // If there was an error report code 400 to the client
        if (err) {
            res.status(400).json({ message: err.message, user });
            return;
        }
        if (user === null) {
            res.status(400).json({ message: 'Could not find user in db', user });
            return;
        }
        // In the future we should implement some sort of check if the exact item is already in the user inventory
        //  and just increment the count of that item, but this would be O(N) for every addition unless some sort of
        //  clever hashing was utilized.
        try {
            for (let i = 0; i < user.inventory.length; i++) {
                if (user.inventory[i]._id.toString() === foodid) {
                    user.inventory.splice(i, 1);
                    user.save().then((updatedUser) => {
                        res.status(200).json({message:'success', updatedUser })
                    }).catch((err) => {
                        res.status(400).json({message: err.message, user});
                    });
                    return;
                }
            }
            res.status(400).json({message: 'Could not find food with id ' + foodid + ' for current user', user});
        } catch (err) {
            res.status(200).json({ message: err.message, user });
        }
    });
};
