// api/ingest.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { run } from '../../../utils/ingest-data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get the GitHub repository URL from the request body
  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({ message: 'No GitHub URL in the request' });
  }

  try {
    // Run the ingestion process with the provided GitHub URL
    const namespace = await run(githubUrl);
    res.status(200).json({ message: 'Ingestion complete', namespace });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
