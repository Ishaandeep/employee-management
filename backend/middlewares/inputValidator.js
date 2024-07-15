const zod = require("zod");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const mobileNoSchema = zod.string().min(10).max(15).regex(/^\d+$/);
const imageSchema = zod
  .object({
    data: zod.instanceof(Buffer).optional(),
    contentType: zod.string().optional(),
  })
  .nullable();
const adminLoginSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(6),
});

const createEmployeeSchema = zod.object({
  name: zod.string().max(50),
  email: zod.string().email(),
  mobileNo: mobileNoSchema,
  designation: zod.string(),
  gender: zod.string(),
  course: zod.string(),
  image: imageSchema,
});

function loginInputValidate(req, res, next) {
  const obj = req.body;
  const response = adminLoginSchema.safeParse(obj);
  if (response.success) {
    next();
  } else {
    res.status(403).json({ msg: "invalid input" });
  }
}

function createEmployeeValidate(req, res, next) {
  const emp = {
    name: req.body.name,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    designation: req.body.designation,
    gender: req.body.gender,
    course: req.body.course,
    image: req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : null,
  };
  // console.log(emp);
  // console.log(emp);
  const response = createEmployeeSchema.safeParse(emp);
  if (response.success) {
    next();
  } else {
    console.error("Validation Errors: ", response.error.issues);
    res
      .status(403)
      .json({ msg: "invalid input", errors: response.error.issues });
  }
}

module.exports = { loginInputValidate, createEmployeeValidate, upload };
