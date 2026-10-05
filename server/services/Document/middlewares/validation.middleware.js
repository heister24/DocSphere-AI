export const validationMiddleware = (schema, source = "body") => {
  return async (req, res, next) => {
    const result = await schema.safeParseAsync(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[source] = result.data;
    next();
  };
};
