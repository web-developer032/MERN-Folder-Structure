import JWT from "jsonwebtoken";
import { promisify } from "util";
import User from "../api/user/user";
import { HTTP_STATUS_CODES } from "../constants/index";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import { ResponseSender } from "../utils/responseHandler";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ["admin","lead-guide"]
    if (!req.user?.role || !roles.includes(req.user.role))
      return next(new AppError("Insufficient access!", 403));
    next();
  };
};

export const protect = asyncHandler(async (req, res, next) => {
  // 1) CHECK TOKEN IF IT EXISTS
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token)
    return next(
      new AppError("Please Login First.", HTTP_STATUS_CODES.UNAUTHORIZED),
    );

  // 2) VERIFY TOKEN
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded); // WILL PRINT THE ID OF DOCUMENT

  // 3) CHECK IF USER STILL EXISTS
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        "User belonging to this token no longer exists.",
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );

  // 4) CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
  if (user.changedPassword(decoded.iat))
    return next(
      new AppError(
        "Password changed recently. Please Login again.",
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );

  res.locals.user = user; // res.locals.user allow us to access user variable in pug templates
  req.user = user;

  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});

export const createToken = (id) =>
  JWT.sign(
    { id }, // PAYLOAD
    process.env.JWT_SECRET, // SECRET
    // OPTIONS FOR LOGIN
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    },
  );

export const createAndSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // this means cookie cannot be modified or accessed by the browser
    // secure: true, // this means cookie will only be used on HTTPS connection not on HTTP
  };

  // if(process.env.NODE_ENV === "PRODUCTION") cookieOptions.secure = true // this means cookie will only be used on HTTPS connection not on HTTP

  res.cookie("jwt", token, cookieOptions);

  // WE DON'T WANT THE USER TO SEE THE PASSWORD
  user.password = undefined;

  return ResponseSender.sendSuccess(res, "Successfully created token.", {
    token,
    user,
  });
};
