import {validateUserToken} from '../utils/token.js'
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();
  if (!authHeader.startsWith("Bearer"))
    return res
      .status(400)
      .json({ error: `Authorization header must start with Bearer` });

  const token = authHeader.split(' ')[1]; //[Bearer , TOken]

  const payload = validateUserToken(token);

  req.user = payload;

  next();

}

export function ensureAuthenticated(req,res,next){
    if ( !req.user || !(req.user.id)) {
    return res.status(400).json({ error: "Unauthorized User" });
  }
  next();
}