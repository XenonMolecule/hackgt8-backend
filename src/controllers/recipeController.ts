import { Response, Request } from 'express';
import {User, UserDocument} from "../models/User";
import {Error} from "mongoose";
import https from 'https';
import {Recipe} from "../models/User/Recipe";

/**
 * Gives suggestions for recipes given a users ingredients and dietary restrictions
 * @route GET /api/recipes
 */
export const getRecipes = async (req: Request, res: Response) => {
    // req.body.accessToken should hold the accessToken to specify the user
    if (req.body === undefined || req.body === null || req.body.accessToken === undefined) {
        res.status(400).json({ message: 'No accessToken provided' });
        return;
    }

    const accessToken = req.body.accessToken;

    const apiKey = process.env.SPOONACULAR_API_KEY;

    User.findOne({ auth0AccessToken: accessToken }, (err:Error, user:UserDocument) => {
        // If there was an error report code 400 to the client
        if (err) {
            res.status(400).json({message: err.message});
            return;
        }
        if (user === null) {
            res.status(400).json({message: 'Could not find user in db'});
            return;
        }

        if (user.recipesUpdated) {
            res.status(200).json({message: 'success', recipes: user.currentRecipes });
            return;
        }

        const ingredientList = user.inventory.map((food) => {
            return food.foodName;
        });

        const ingredientString:string = ingredientList.join();

        const urlBuilder:string[] = ['https://api.spoonacular.com/recipes/findByIngredients?number=10&ranking=2&ignorePantry=true'];
        if (ingredientString !== '') {
            urlBuilder.push(`&ingredients=${ingredientString}`);
        }
        urlBuilder.push(`&apiKey=${apiKey}`);
        const url = encodeURI(urlBuilder.join(''));

        const request = https.get(url, function(response) {

            // Buffer the body entirely for processing as a whole.
            const bodyChunks:any[] = [];
            response.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                const body = JSON.parse(Buffer.concat(bodyChunks).toString());
                const ids = body.map((item:any) => {
                    return item.id.toString();
                });
                const url2 = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join()}&apiKey=${apiKey}`;
                const request2 = https.get(url2, function(response2) {
                    const bodyChunks2:any[] = [];
                    response2.on('data', function(chunk) {
                        bodyChunks2.push(chunk);
                    }).on('end', function() {
                        const body2 = JSON.parse(Buffer.concat(bodyChunks2).toString());
                        console.log(body2);
                        const recipes:Recipe[] = [];
                        let i = -1;
                        body2.forEach((recipe:any) => {
                            i += 1;
                            // check if the recipe uses gluten and the user can't eat gluten
                            if (!recipe.glutenFree && 'gluten_free' in user.dietaryRestrictions) {
                                return;
                            }
                            // check if the recipe is not vegan and the user is vegan
                            if (!recipe.vegan && 'vegan' in user.dietaryRestrictions) {
                                return;
                            }
                            // check if the recipe has dairy and the user is dairy free
                            if (!recipe.dairyFree && 'dairy_free' in user.dietaryRestrictions) {
                                return;
                            }
                            // check if the recipe is not vegetarian and the use is vegetarian
                            if (!recipe.vegetarian && 'vegetarian' in user.dietaryRestrictions) {
                                return;
                            }

                            const ingredients = recipe.extendedIngredients.map((ingredient:any) => {
                                return ingredient.name;
                            });

                            const newRecipe:Recipe = {
                                dairyFree: recipe.dairyFree,
                                diets: recipe.diets,
                                glutenFree: recipe.glutenFree,
                                healthScore: recipe.healthScore,
                                imageUrl: recipe.image,
                                ingredients: ingredients,
                                instructions: recipe.instructions,
                                ketogenic: recipe.ketogenic,
                                name: recipe.title,
                                sourceUrl: recipe.sourceUrl,
                                spoonacularID: recipe.id,
                                vegan: recipe.vegan,
                                vegetarian: recipe.vegetarian
                            };

                            recipes.push(newRecipe);
                        });
                        user.recipesUpdated = true;
                        user.currentRecipes = recipes;
                        user.save().then(() => {
                            res.status(200).json({message: 'success', recipes });
                        }).catch((err) => {
                            res.status(400).json({message: err.message});
                        })
                    });
                });

                request2.on('error', function(e) {
                    res.status(400).json({message: e.message});
                })
            })
        });

        request.on('error', function(e) {
            res.status(400).json({message: e.message});
        });
    });
};
