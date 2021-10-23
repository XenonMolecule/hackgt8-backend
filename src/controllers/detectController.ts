import { Response, Request } from 'express';

import vision from '@google-cloud/vision';
import fs from 'fs';
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import {google} from "@google-cloud/vision/build/protos/protos";
import IAnnotateImageResponse = google.cloud.vision.v1p2beta1.IAnnotateImageResponse;

/**
 * Adds a new food to the current user's inventory
 * @route POST /api/detect/food
 */
export const postFood = async (req: Request & {files:any}, res: Response) => {
    // req.files.image should hold the uploaded image to forward to Azure
    if (req.files === undefined || req.files === null || req.files.image === undefined) {
        res.status(400).json({message: 'No image included with key \'image\'', donationform: {}});
        return;
    }

    const client = new vision.ImageAnnotatorClient();

    const imageName = uuidv4() + req.files.image.name;
    const uploadPath = path.join(__dirname, "../tmp/" + imageName);

    fs.writeFile(uploadPath, req.files.image.data,(err) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return
        }
        client.labelDetection(uploadPath).then((result:[IAnnotateImageResponse]) => {
            const labels = result[0].labelAnnotations;
            let labelResponse = labels.map((lbl) => {
                return lbl.description;
            });
            labels.forEach(label => console.log(label.description));
            res.status(200).json({ message: 'success', 'labels': labelResponse });
        }).catch((err) => {
            res.status(400).json({ message: err.message });
        });
    });
};
