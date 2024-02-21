import asyncHandler from "../../utils/asyncHandler.js";

export const getUser = asyncHandler(async (req, res, next) => {
  return res.json({
    name: "Mubasher",
    age: 25,
  });
});
