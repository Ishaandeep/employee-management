const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes");

const port = process.env.PORT || 3000;
const connectDb = async () => {
  const response = await mongoose.connect(
    "mongodb+srv://ishaan:RporavOgFURdi5my@clusteremployee.laa7ecx.mongodb.net/"
  );
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
