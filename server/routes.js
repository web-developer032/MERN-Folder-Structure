// import the routes for '/books'
const bookRoutes = require("./api/books");
// or ES6 module
// import bookRoutes from './api/books';

// wire up to the express app
app.use("/api/books", bookRoutes);
