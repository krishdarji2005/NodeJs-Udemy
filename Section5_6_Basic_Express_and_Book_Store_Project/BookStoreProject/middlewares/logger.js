const fs = require("node:fs")
exports.loggerMiddleware = function(req,res,next){
  const log = `\n[${Date.now()}] ${req.method} ${req.path}`
  fs.appendFileSync('/logs.txt',log,'utf8');//file is in root 
  next();
};