const express = require("express");
const fs = require("node:fs")

const app = express();

const PORT = 8000;

//we dont have DB so we created a memory array containing books
//this violate the REST rule

//mock data
const books = [
  { id: 1, title: "Book One", author: "Author One" },
  { id: 2, title: "Book Two", author: "Author Two" },
];

//Middlewares(Plugins)

/*What this plugin is now doing is that if some data comes from the front end and it has a header that is application/ JSON, it will do all the transformations for me and give me the actual data in the request or body.*/
app.use(express.json());

app.use(function(req,res,next){
  const log = `\n[${Date.now()}] ${req.method} ${req.path}`
  fs.appendFileSync('/logs.txt',log,'utf8');//file is in root 
  next();
})

//Routes
app.get("/", (req, res) => {
  res.json([
    {
      route: "/books",
      contains: "All books",
    },
    {
      route: "/books/:id",
      contains: "Get book by its id",
    },
  ]);
});

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id); //id is in url if varibale name = op /books/:op and req.params.op , this is in strong do parseInt to convert in number for using ===

  if (isNaN(id))
    return res.status(400).json({ error: "Bad Request id must be number" });

  const book = books.find((e) => e.id == id);

  if (!book) {
    return res.status(404).json({ error: `Book with id ${id} does not exist` });
  }
  res.json(book);
});

app.post("/books", (req, res) => {
  console.log(req.headers); // .. 'content-type': 'application/json', or text what you send
  //backend dont know how to read this different type of data

  const { title, author } = req.body;

  if (!title || title === "")
    return res.status(400).json({ error: "title is required" });

  if (!author || author === "")
    return res.status(400).json({ error: "author is required" });

  const id = books.length + 1;
  const book = { id, title, author };
  books.push(book);

  console.log(req.body); //o/p is undefined even though body me bheja   //add middleware

  return res
    .status(201)
    .json({ message: "Book created succesfully with id ", id });
});

app.delete('/books/:id',(req,res)=>{
  const id = parseInt(req.params.id);
  if(isNaN(id))  return res.status(400).json({ error: "Bad Request id must be number" });

  const indexToDel = books.findIndex(e => e.id === id);

  if(indexToDel<0){
    return res.status(404).json({error:`book with id ${id} does not exist `})
  }
  books.splice(indexToDel,1);//start,delCOunt
  return res.status(200).json(`Book Deleted`)

})


app.listen(PORT, () => {
  console.log(`HTTP Srver is running on port ${PORT}`);
});
