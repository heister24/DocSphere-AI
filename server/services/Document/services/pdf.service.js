import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = new PDFParse({ data: buffer });

    const textResult = await data.getText();
    const infoResult = await data.getInfo();

    const text = textResult.text;
    const pages = infoResult.pages;

    await data.destroy();

    return {
      text,
      pages,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
