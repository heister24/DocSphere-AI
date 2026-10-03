import Document from "../models/document.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import splitText from "../services/textSplitter.service.js";

export const uploadDocument = async (req, res) => {
  try {
    // Check authentication
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //  Check PDF file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    // Extract text from PDF
    // console.log(req.file.buffer);
    const { text, pages } = await extractTextFromPDF(req.file.buffer);
    // console.log(pages, text);
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the PDF",
      });
    }

    //  Split extracted text into chunks
    const chunks = await splitText(text);

    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not created document chunks",
      });
    }

    const document = await Document.create({
      userId,
      originalName: req.file.originalname,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      status: "UPLOADED",
      totalPages: pages.length,
      totalChunks: chunks.length,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        originalName: document.originalName,
        fileSize: document.fileSize,
        totalPages: document.totalPages,
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
