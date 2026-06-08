require("dotenv/config");
const express = require("express");
const bookRouter = require("./routes/book.routes");
const authorRouter = require("./routes/author.routes");
const { loggerMiddleware } = require("./middlewares/logger");

const app = express();
const PORT = 8000;

//we dont have DB so we created a memory array containing books
//this violate the REST rule

// main file

app.use(express.json());
app.use(loggerMiddleware);

//Routes
//moved to router file
app.use("/books", bookRouter); //for all the routes matches /books fo to this routes
app.use("/author",authorRouter);

app.listen(PORT, () => {
  console.log(`HTTP Srver is running on port ${PORT}`);
});

//Middlewares(Plugins)

/*What this plugin is now doing is that if some data comes from the front end and it has a header that is application/ JSON, it will do all the transformations for me and give me the actual data in the request or body.*/
