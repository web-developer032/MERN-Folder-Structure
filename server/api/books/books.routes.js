const express = require("express");
const booksRoutes = express.Router();
// or ES6
// import { Router as booksRoutes } from 'express';

// Handlers
const booksHandlers = require("./books.handlers");

// list all books
booksRoutes.get("/", booksHandlers.books);

// export bookRoutes
module.exports = booksRoutes;
// or ES6
// export default booksRoutes;
