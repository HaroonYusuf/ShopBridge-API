var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

const userSchema = require("../MongoDB_Schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/add", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new userSchema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
        contact: req.body.contact,
      });

      user.save((err, user) => {
        if (err) {
          res.send({ status: 500, message: "unable to create user" });
        } else {
          res.send({ status: 200, message: "user created", userDetails: user });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  userSchema
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
            console.log(result)
          return res.status(401).json({
            msg: "password matching fail",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user[0].name,
              email: user[0].email,
              password: user[0].password,
              contact: user[0].contact,
            },
            "this is dummy text",
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({
            name: user[0].name,
            email: user[0].email,
            password: user[0].password,
            contact: user[0].contact,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.send(500).json({
        err: err,
      });
    });
});

module.exports = router;
