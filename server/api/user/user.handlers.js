import multer from "multer";
import sharp from "sharp";
import { HTTP_STATUS_CODES } from "../../constants/index.js";
import asyncHandler from "../../utils/asyncHandler.js";
import factory from "../../utils/factory.js";
import { ResponseSender } from "../../utils/responseHandler";
import AppError from "../utils/appError";
import utils from "../utils/utils";
import User from "./user";

// FOR STORING FILE ON DISK
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// FOR STORRING FILE ON MEMORY
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Invalid File, Please upload Image.", 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const resizePhoto = async (req) => {
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/assets/images/users/${req.file.filename}`);
};

const uploadUserPhoto = upload.single("photo"); // UPLOAD SINGLE FILE

const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}.jpeg`;

  await this.resizePhoto(req);
  // BUFFER METHOD AVAILABLE WHEN STORING ON RAM
  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);

  return next();
});

const updateMe = asyncHandler(async (req, res, next) => {
  // 1) IF USER TRIED TO UPDATE PASSWORD SEND ERROR!
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "This route is not for Password updating. Inorder to update password use this route updatePassword",
        400,
      ),
    );

  // 2) Filter DATA
  const filteredBody = utils.filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) UPDATE USER DATA
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // this means return new object
    runValidators: true,
  });

  return ResponseSender.sendSuccess(res, "Successfully updated user.", user);
});

const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return ResponseSender.sendSuccess(
    res,
    "Successfully deleted user.",
    null,
    HTTP_STATUS_CODES.NO_CONTENT,
  );
});

// -------------------------------------------
// MAKING CODE ADVANCE USING FACTORY FUNCTIONS
// -------------------------------------------

const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);
const createUser = factory.createOne(User); // DON'T UPDATE PASSWORD USING THIS FUNCTION.
const updateUser = factory.updateOne(User); // DON'T UPDATE PASSWORD USING THIS FUNCTION.
const deleteUser = factory.deleteOne(User);

export {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  resizePhoto,
  resizeUserPhoto,
  updateMe,
  updateUser,
  uploadUserPhoto,
};
