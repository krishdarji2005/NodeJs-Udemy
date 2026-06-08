import jwt from "jsonwebtoken";

export const authenticationMiddleware = async function (req, res, next) {
  try {
    const tokenHeader = req.headers["authorization"];

    // no auth header -> continue as not logged
    if (!tokenHeader) {
      return next();
    }
    // Header -> key = authorization : value = Bearer <TOKEN>
    if (!tokenHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "authorization header must start with Bearer" });
    }

    const token = tokenHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    next();
  }
};

export const ensureAuthenticated = async function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "You must be authenticated" });
  }
  next();
};

export const restrictToROle = function (role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res
        .status(401)
        .json({ error: "you are not authorized to access this resource" });
    }
    return next();
  };
};

//the above is closure middleware function in which you call will return middleware function 
//const middlewareFUnc = restrictToROle(admin)
//then this function to be used see admin routes