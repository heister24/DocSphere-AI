export const validateDocumentUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a PDF file",
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  if (req.file.size === 0) {
    return res.status(400).json({
      success: false,
      message: "Uploaded file is empty",
    });
  }

  next();
};
