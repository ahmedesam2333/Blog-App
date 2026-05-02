export const errorHandling = async ({ res, error } = {}) => {
  switch (error?.name) {
    case "SequelizeValidationError":
      return res.status(400).json({ message: "Validation Error", error });
    case "SequelizeUniqueConstraintError":
      return res.status(409).json({ message: "UniqueConstraintError", error });
    default:
      return res.status(500).json({
        message: "Server Error",
        err_message: error.message,
        stack: error.stack,
        error,
      });
  }
};

export const successResponse = async ({
  res,
  status = 200,
  message = "Done",
  data = {},
} = {}) => {
  return res.status(status).json({
    message,
    data,
  });
};
