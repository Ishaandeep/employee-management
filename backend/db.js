const mongoose = require("mongoose");

const Employee = mongoose.model("Employee", {
  _id: { type: Number },
  name: { type: String, required: true, trim: true, maxLength: 50 },
  email: { type: String, required: true, unique: true }, // Add 'unique: true'
  mobileNo: { type: String, required: true }, // Change to String
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  course: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Admin = mongoose.model("Admin", {
  username: { type: String, required: true, trim: true, maxLength: 50 },
  password: String,
});

module.exports = { Employee, Admin };
