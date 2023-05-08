// api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '../../../utils/makechain';
import { pinecone } from '../../../utils/pinecone-client';
import { PINECONE_INDEX_NAME } from '../../../config/pinecone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history, githubUrl, namespace } = req.body;

  console.log('question', question);

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Sorry, AskGit only accepts POST requests. Please use a POST request to send your question.' });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: 'Oops! Looks like you forgot to ask a question. Please provide a question and try again.' });
  }
  
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: namespace,
      },
    );

    // Create chain
    const chain = makeChain(vectorStore);
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);

    type SourceDocument = {
      metadata: {
        source?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };

    // Check if the response text contains any of the "not found" messages
    const notFoundMessages = [
      "I'm sorry, but I don't understand",
      "I'm sorry, but as an AI code assistant",
      'I am here to answer any specific questions related to code analysis',
      "I'm sorry, but I cannot answer that question",
      "As an AI code assistant, I am here to assist with any questions related to code analysis",
      "I'm sorry, but as an AI code assistant, my expertise is limited to analyzing code and information in multiple programming languages",
    ];

    // Check if any part of the notFoundMessages array is included in the response text
    const showSources = !notFoundMessages.some(msg => response.text.includes(msg));

    // Extract the source documents from the response only if the response text does not contain any of the "not found" messages
    const sourceDocuments = showSources ? response.sourceDocuments || [] : [];

    // Modify the source documents to include the filename only if the response text does not contain any of the "not found" messages
    const modifiedSourceDocuments = showSources ? sourceDocuments.reduce((acc: SourceDocument[], doc: SourceDocument, i: number) => {
      // Use the source property if it exists, otherwise use a default value
      const source = doc.metadata.source || 'unknown';
      const firstWordOfSource = source.split(' ')[0];
      const filename = firstWordOfSource !== 'unknown' ? firstWordOfSource : `Source${i}`;

      // Only include the source document if it has a valid filename (not equal to `Source${i}`)
      if (filename !== `Source${i}`) {
        acc.push({ ...doc, filename });
      }
      return acc;
    }, []) : [];

    // Include the modified source documents in the response object only if the response text does not contain any of the "not found" messages
    res.status(200).json({
      text: response.text,
      sourceDocuments: modifiedSourceDocuments
    });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
