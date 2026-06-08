const { booksTable, authorsTable } = require("../models/index");
const db = require("../db/index");
const { eq,sql } = require("drizzle-orm");

exports.getAllAuthors = async function(req,res){
    const authors = await db.select().from(authorsTable);
    return res.json(authors);
} 
exports.getAuthorById = async function(req,res){
    const id = req.params.id;
    const [author] = await db.select().from(authorsTable).where(eq(authorsTable.id,id));

    if(!author){
      return res.status(404).json({
      error: "Author not found",
    });
  }
  return res.json(author);
} 
exports.createAuthor = async function(req,res){
  const {firstName,email} = req.body;
  if (!firstName || firstName === "" || !email || email==="")
    return res.status(400).json({ error: "name and email is required" });

 const [result] = await db.insert(authorsTable).values({firstName,email}).returning({id:authorsTable.id});

 return res.status(201).json({message:"Author created successfully with id",id:result.id});


}
exports.deleteAuthorById = async function(req,res){
  const id = req.params.id;
  if (!id)
    return res.status(400).json({ error: "provide valid id" });
  
   const [author] = await db.select().from(authorsTable).where(eq(authorsTable.id,id));
  
  if(!author){
    return res.status(404).json({ error: "Author not found" });
  }


  await db.delete(authorsTable).where(eq(authorsTable.id,id));

 

 return res.status(200).json({message:"Author deleted successfully"});


}