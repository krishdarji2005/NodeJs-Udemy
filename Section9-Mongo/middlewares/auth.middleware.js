import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const getHeader = req.header["authorization"];

    if (!getHeader) {
      return next();
    }
    if (!getHeader.startsWith('Bearer')) {
      return res.status(400).json({error:'Authorization header must begin with Bearer'})
    }

    const token = getHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const ensureAuthenticated = async (req,res,next)=>{
  if(!req.user){
    return res.status(401).json({
      error:'You must be authenticated to access this'
    })
  }
  next();
}