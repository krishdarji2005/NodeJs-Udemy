// const { BOOKS } = require("../models/books");
const BOOKS = [{}];
const { booksTable, authorsTable } = require("../models/index");
const db = require("../db/index");
const { eq,sql } = require("drizzle-orm");

//actual logic to do things
exports.getAllBooks = async function (req, res) {
  const search = req.query.search;
  if (search) {
    const books = await db
      .select()
      .from(booksTable)
      .where(
        sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`
      );
      return res.json(books)
  }
  const books = await db.select().from(booksTable);
  return res.json(books);
};

exports.getBookById = async function (req, res) {
  const id = req.params.id; // keep as string (UUID)

  const book = await db
    .select()
    .from(booksTable)
    .where((table) => eq(table.id, id))
    .leftJoin(authorsTable, eq(booksTable.author, authorsTable.id));
    

  if (!book) {
    return res.status(404).json({ error: `Book with id ${id} does not exist` });
  }

  return res.json(book);
};

exports.createBook = async function (req, res) {
  const { title, description, author } = req.body; // Changed authorId to author

  if (!title || title === "")
    return res.status(400).json({ error: "title is required" });

  if (!author || author === "")
    return res.status(400).json({ error: "author is required" });

  const [result] = await db
    .insert(booksTable)
    .values({
      title,
      description,
      author,
    })
    .returning({ id: booksTable.id });

  return res
    .status(201)
    .json({ message: "Book created succesfully with id ", id: result.id });
};
exports.deleteBookById = async function (req, res) {
  const id = req.params.id;

  await db.delete(booksTable).where(eq(booksTable.id, id));
  return res.status(200).json(`Book Deleted`);
};
