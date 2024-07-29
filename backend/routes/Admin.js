const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin, Employee } = require("../db");

const {
  loginInputValidate,
  createEmployeeValidate,
  upload,
} = require("../middlewares/inputValidator");
const {
  authMiddleware,
  loginAuthMiddleware,
} = require("../middlewares/authMiddleware");
const adminRouter = express.Router();

function getjwt(id) {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET);
  return token;
}
function getUserAfterVerify(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId;
}
adminRouter.post("/signup", loginInputValidate, (req, res) => {
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  // console.log(req.body);
  bcrypt.hash(password, 10, async (err, hash) => {
    if (!err) {
      const newAdmin = new Admin({
        username: username,
        password: hash,
      });
      newAdmin.save().then((response) => {
        const token = getjwt(response._id);
        res.status(201).json({
          msg: "Admin Created Successfully",
          token: token,
          admin: newAdmin,
        });
      });
    }
  });
});

adminRouter.post(
  "/login",
  loginInputValidate,
  loginAuthMiddleware,
  async (req, res, next) => {
    const username = req.body.username;
    const token = getjwt(username);
    res.status(200).json({
      msg: `Welcom ${username}`,
      token: token,
    });
  }
);
adminRouter.post(
  "/create",
  upload.single("image"),
  createEmployeeValidate,
  authMiddleware,
  async (req, res, next) => {
    try {
      // Generate unique ID
      const existingIds = await Employee.find({}, { _id: 1 }).lean();
      const existingIdSet = new Set(existingIds.map((doc) => doc._id));
      // console.log(existingIdSet);

      async function generateUniqueId() {
        for (let i = 1; i <= 1000; i++) {
          if (!existingIdSet.has(i)) {
            return i;
          }
        }
        throw new Error("No available IDs");
      }
      const uniqueId = await generateUniqueId();
      // Prepare employee data
      const emp = {
        _id: uniqueId,
        image: req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            }
          : null,
        name: req.body.name,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        designation: req.body.designation,
        gender: req.body.gender,
        course: req.body.course,
      };

      // Check if employee with the same email exists
      const existingEmp = await Employee.findOne({ email: emp.email }).exec();
      if (existingEmp) {
        return res
          .status(400)
          .json({ msg: "Email already exists, enter a unique email" });
      }

      // Save new employee
      const newEmp = new Employee(emp);
      const savedEmp = await newEmp.save();

      // Construct the response
      const responseImage = savedEmp.image
        ? {
            contentType: savedEmp.image.contentType,
            data: savedEmp.image.data
              ? savedEmp.image.data.toString("base64") // Convert Buffer to Base64 if data exists
              : null,
          }
        : null;

      const savedEmpResponse = {
        _id: savedEmp._id,
        name: savedEmp.name,
        email: savedEmp.email,
        mobileNo: savedEmp.mobileNo,
        designation: savedEmp.designation,
        gender: savedEmp.gender,
        course: savedEmp.course,
        createDate: savedEmp.createDate,
        image: responseImage,
      };

      res.status(201).json({
        msg: "Employee Created Successfully",
        Employee: savedEmpResponse,
      });
    } catch (err) {
      console.error("Error saving employee:", err);
      res
        .status(500)
        .json({ msg: "Error saving employee", error: err.message });
    }
  }
);

adminRouter.get("/bulk", authMiddleware, async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();

    // Map and reorder the fields
    const formattedEmployees = employees.map((employee) => {
      const responseImage = employee.image
        ? {
            contentType: employee.image.contentType,
            data: employee.image.data
              ? employee.image.data.toString("base64") // Convert Buffer to Base64 if data exists
              : null,
          }
        : null;

      return {
        _id: employee._id,
        image: responseImage,
        name: employee.name,
        email: employee.email,
        mobileNo: employee.mobileNo,
        designation: employee.designation,
        gender: employee.gender,
        course: employee.course,
        createDate: employee.createDate,
      };
    });

    res
      .status(200)
      .json({ msg: "all employee", employees: formattedEmployees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ msg: "internal server error", error: err.message });
  }
});
adminRouter.get("/employee/:id", authMiddleware, async (req, res) => {
  const uniqueId = req.params.id;
  const employee = await Employee.findOne({ _id: uniqueId });
  if (employee) {
    res.status(200).json({
      msg: "employee Found",
      employee,
    });
  } else {
    res.status(400).json({ msg: `Employee id: ${uniqueId} do not exists` });
  }
});

adminRouter.put(
  "/edit/:id",
  upload.single("image"),
  createEmployeeValidate,
  authMiddleware,
  async (req, res) => {
    const uniqueId = req.params.id;
    const emp = {
      _id: uniqueId,
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
      name: req.body.name,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course,
    };
    const dbResponse = await Employee.findByIdAndUpdate(uniqueId, emp, {
      new: true,
    });
    if (dbResponse) {
      // console.log(dbResponse);
      res.status(200).json({ msg: "updated Successfully", dbResponse });
    } else {
      res.status(411).json({ msg: "unable to update" });
    }
  }
);
adminRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const empId = req.params.id;
    const result = await Employee.findByIdAndDelete(empId);
    if (result) {
      res
        .status(200)
        .json({ msg: "Employee deleted Successfully", employee: result });
    } else {
      res.status(404).json({ msg: "Employee not found" });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
});
adminRouter.get("/verify", authMiddleware, async (req, res) => {
  try {
    console.log("1");
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    const username = getUserAfterVerify(token);
    res.status(200).json({ msg: "Admin is verified", username: username });
  } catch (err) {
    res.status(403).json({ msg: "User Is not authorized, Re Login" });
  }
});

module.exports = adminRouter;
