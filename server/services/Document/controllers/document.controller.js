import Document from "../models/document.model.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is missing or not found",
      });
    }
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information is missing",
      });
    }

    const document = await Document.create({
      userId,
      originalName: req.file.originalname,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      status: "UPLOADED",
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        originalName: document.originalName,
        fileSize: document.fileSize,
        status: document.status,
      },
    });
  } catch (error) {
    console.log(`Upload Document error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
