const express = require("express");
const mainRouter = express.Router();
const adminRouter = require("./Admin");

mainRouter.use("/admin", adminRouter);

module.exports = mainRouter;
