var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");

const uid2 = require("uid2");
const token = uid2(32);
const bcrypt = require("bcrypt");

/* GET users listing. */

router.post("/signup", function (req, res) {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hash,
        firstname: req.body.firstname,
        token: token,
      });
      newUser.save().then((data) => {
        res.json({ result: true, user: data });
      });
    } else {
      res.json({ result: false, error: "your account already exists !" });
    }
  });
});

module.exports = router;
