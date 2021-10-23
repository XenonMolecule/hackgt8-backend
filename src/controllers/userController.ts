import { Error } from 'mongoose';

import { Response, Request } from 'express';
import { User, UserDocument} from '../models/User';

/**
 * Gets User Info or returns onboard status
 * @route GET /api/user
 */
export const getUser = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

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
        // Successfully found the user information based on the auth0token
        res.status(200).json({ message: 'success', user });
    });
};

/**
 * Create a new user
 * @route POST /api/user
 */
export const postUser = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    // req.body.data should hold the information to create the user
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'No user information provided', user: {} });
        return;
    }

    const newUser = JSON.parse(req.body.data);
    newUser.auth0AccessToken = accessToken;

    User.create(newUser, function(err:Error, user:UserDocument) {
        if (err) {
            res.status(400).json({ message: err.message, user });
            return;
        }
        res.status(200).json({ message: 'success', user });
    });
};

/**
 * Update a user
 * @route PUT /api/user
 */
export const putUser = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    // req.body.data should hold the donationform information to save to the user
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'No user information provided', user: {} });
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
            res.status(400).json({ message: 'Could not find user in db', user });
            return;
        }

        const updatedUser = JSON.parse(req.body.data);

        for (const key in updatedUser) {
            if(updatedUser.hasOwnProperty(key)) {
                user.set(key, updatedUser[key]);
            }
        }

        user.save().then(() => {
            res.status(200).json({ message: 'success', user });
        }).catch((err) => {
            res.status(400).json({ message: 'Could not find user in db', user });
        });
    });
};

/**
 * Delete a user
 * @route DELETE /api/user
 */
export const deleteUser = (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided', user: {} });
        return;
    }

    const accessToken = req.body.accessToken;

    User.deleteOne({ auth0AccessToken: accessToken }, (err:Error, deletedInfo:any) => {
        if (err) {
            res.status(400).json({ message: err.message, info: deletedInfo });
            return;
        }
        res.status(200).json({ message: 'success', info: deletedInfo });
    });
};
