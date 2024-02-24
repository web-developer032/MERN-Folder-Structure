import { HTTP_STATUS_CODES } from "../constants";
import APIFeature from "./apiFeature";
import AppError from "./appError";
import asyncHandler from "./asyncHandler";
import { ResponseSender } from "./responseHandler";

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError("No Document found with the specific ID. "));

    return ResponseSender.sendSuccess(
      res,
      "Successfully deleted document.",
      null,
      HTTP_STATUS_CODES.NO_CONTENT,
    );
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // this means return new updated document
      runValidators: true, // validate data everytime it change
    });
    if (!doc) return next(new AppError("Invalid Document ID", 404));

    return ResponseSender.sendSuccess(
      res,
      "Successfully updated document.",
      doc,
    );
  });

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    return ResponseSender.sendSuccess(
      res,
      "Successfully created document.",
      doc,
      HTTP_STATUS_CODES.CREATED,
    );
  });

const getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError("Invalid Doc ID", 404));

    return ResponseSender.sendSuccess(
      res,
      "Successfully fetched document.",
      doc,
      HTTP_STATUS_CODES.CREATED,
    );
  });

const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    // TWO LINES FOR ALLWOING NESTED ROUTES. GET REVIEWS OF A SPECIFIC TOUR  --- HACK
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();

    // EXECUTE QUERY
    // const docs = await features.query.explain(); // FOR VIEWING DETAILS ABOUT QUERY
    const docs = await features.query;

    return ResponseSender.sendSuccess(
      res,
      "Successfully fetched all documents.",
      docs,
    );
  });

export { createOne, deleteOne, getAll, getOne, updateOne };
