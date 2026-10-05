import Document from "../models/document.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { deleteDocumentVectors } from "../services/qdrant.service.js";
import { retrieveRelevantChunks } from "../services/retrieval.service.js";
import splitText from "../services/textSplitter.service.js";
import { storeDocumentsInQdrant } from "../services/vector.service.js";

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
    const { text, totalPages } = await extractTextFromPDF(req.file.buffer);
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
      totalPages,
      totalChunks: chunks.length,
    });

    // Store documet in qdrant DB
    await storeDocumentsInQdrant({
      documents: chunks,
      documentId: document._id,
      userId,
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

export const retrieveDocumentChunks = async (req, res) => {
  try {
    // const userId = req.headers["x-user-id"];
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { query, documentId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // Retrieve relevant chunks from Qdrant
    const results = await retrieveRelevantChunks({
      query,
      userId: userId.toString(),
      documentId,
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "Relevant document chunks retrieved successfully",
      results,
    });
  } catch (error) {
    console.error("Retrieve document chunks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve relevant document chunks",
    });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    const documents = await Document.find({ userId })
      .select(
        "_id originalName fileName mimeType fileSize status errorMsg totalPages totalChunks qdrantCollection createdAt updatedAt",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get user documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    const document = await Document.findOne({
      $or: [{ _id: id }, { userId }],
    }).select(
      "_id originalName fileName mimeType fileSize status errorMsg totalPages totalChunks createdAt updatedAt",
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get document by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // Find document belonging to logged-in user
    const document = await Document.findOne({ $or: [{ _id: id }, { userId }] });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete vectors from Qdrant
    await deleteDocumentVectors({ documentId: id, userId });

    // Delete document from MongoDB
    await Document.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};
