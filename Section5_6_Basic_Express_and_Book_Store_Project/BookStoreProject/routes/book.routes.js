const express = require("express");
const controller = require('../controllers/books.controller')

const router = express.Router();

// "/books is common so remove " 
// app.use('/books',bookRouter);
//controller (req, res) => {
//   res.json(BOOKS);
// }
router.get("/",controller.getAllBooks);

router.get("/:id", controller.getBookById);

router.post("/", controller.createBook);

router.delete("/:id",controller.deleteBookById);

//default export of this router
module.exports = router;
