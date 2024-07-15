const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
// const { JWT_SECRET } = require("../config");
require("dotenv").config();

const { Admin } = require("../db");

async function loginAuthMiddleware(req, res, next) {
  const dbResponse = await Admin.findOne({ username: req.body.username });
  if (dbResponse) {
    bcrypt.compare(req.body.password, dbResponse.password, (err, result) => {
      if (result) {
        next();
      } else {
        res.status(404).json({ msg: "Check you password" });
      }
    });
  } else {
    res.status(404).json({ msg: "user not found" });
  }
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ msg: "Wrong token" });
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      return res.status(403).json({ msg: "Not authorized" });
    }
  }
}
// if (authHeader && authHeader.startsWith("Bearer ")) {
//   token = authHeader.split(" ")[1];
//   try {
//     const decode = jwt.verify(token, JWT_SECRET);
//     next();
//   } catch (err) {
//     res.status(403).json({ msg: "Not authorized" });
//   }
// } else {
//   // !auth or
//   // !bearer
//   if (!authHeader) {
//     const username = req.body.username;
//     // const password = req.body.password;
//     const dbResponse = await Admin.findOne({ username: username });
//     if (dbResponse) {
//       bcrypt.compare(
//         req.body.password,
//         dbResponse.password,
//         (err, result) => {
//           if (result) {
//             next();
//           } else {
//             res.status(404).json({ msg: "Check you password" });
//           }
//         }
//       );
//     } else {
//       res.status(500).json({ msg: "unable to find user" });
//     }
//   } else {
//     res.status(403).json({ msg: "Wrong token" });
//   }
// }

module.exports = { authMiddleware, loginAuthMiddleware };
