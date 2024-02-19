import AppError from "../utils/appError";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ["admin","lead-guide"]
    if (!req.user?.role || !roles.includes(req.user.role))
      return next(new AppError("Insufficient access!", 403));
    next();
  };
};
