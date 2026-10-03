import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { text } from "express";

const splitter = new RecursiveCharacterTextSplitter({
  chunkOverlap: 100,
  chunkSize: 1000,
});

const splitText = async (text) => {
  return await splitter.createDocuments([text]);
};

export default splitText;
