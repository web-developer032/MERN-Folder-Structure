const { listBooks } = require("./books");

exports.books = async function (req, res) {
    const { user } = req.body;
    const filters = req.query;
    try {
        // get list of books
        const result = await listBooks({ user, filters });
        res.json(result);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: "Problem fetching books." });
    }
};
