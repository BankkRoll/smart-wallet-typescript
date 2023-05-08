// utils/ingest-data.ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '../utils/pinecone-client';
import { PINECONE_INDEX_NAME } from '../config/pinecone';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import crypto from 'crypto';

export const run = async (githubUrl: string) => {
  try {
    // Load raw docs from the GitHub repository
    const loader = new GithubRepoLoader(githubUrl, {
      branch: 'main',
      recursive: true,
      unknown: 'warn',
    });
    const rawDocs = await loader.load();

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    // Set the metadata property for each document
    const docsWithMetadata = docs.map(doc => ({
      ...doc,
      metadata: { filename: doc.metadata?.filename },
    }));

    // Create and store the embeddings in the vectorStore
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // Generate a unique namespace based on the GitHub URL
    const hash = crypto.createHash('sha256');
    hash.update(githubUrl);
    const namespace = hash.digest('hex');

    // Embed the documents using the generated namespace
    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
      pineconeIndex: index,
      namespace: namespace,
      textKey: 'text',
    });

    // Return the namespace to the caller
    return namespace;
  } catch (error) {
    console.error('AskGit: Error during ingestion process:', error);
    throw new Error('AskGit encountered an issue while ingesting your data. Please check the GitHub URL and try again.');
  }
};