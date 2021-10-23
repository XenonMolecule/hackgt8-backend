import jwt from 'express-jwt';
import { Response, Request, NextFunction } from 'express';
import jwksRsa from 'jwks-rsa';
import jwt_decode, {JwtPayload} from 'jwt-decode';


export const checkJwt = jwt({
    // Dynamically provide a signing key
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ajdj9ych.us.auth0.com/.well-known/jwks.json'
    }),

    // validate the audience and the issuer
    issuer: 'https://dev-ajdj9ych.us.auth0.com/',
    algorithms: ['RS256']
});

export const extractToken = (req: Request, res: Response, next: NextFunction) => {
    const jwt_decoded = <JwtPayload>jwt_decode(req.headers.authorization);
    req.body.accessToken = jwt_decoded['sub'];
    next();
};
