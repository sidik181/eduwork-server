var router = require("express").Router();

const title = process.env.SERVICE_NAME;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title });
});

module.exports = router;
