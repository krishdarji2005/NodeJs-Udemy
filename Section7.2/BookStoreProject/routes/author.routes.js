const express = require('express');
const router = express.Router();

const controller = require('../controllers/author.controller');

router.get("/",controller.getAllAuthors);
router.get("/:id",controller.getAuthorById);
router.post("/",controller.createAuthor);
router.delete("/:id",controller.deleteAuthorById);

module.exports = router