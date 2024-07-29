const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const mainRouter = require("./routes");
const connectionString = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const connectDb = async () => {
  const response = await mongoose.connect(connectionString);
  if (response) {
    console.log("db is now connected");
  }
};
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "hi" });
});
connectDb();
app.listen(port, () => {
  console.log("App is listening at http://localhost:3000");
});
