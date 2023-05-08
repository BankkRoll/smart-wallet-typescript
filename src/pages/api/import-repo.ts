// pages/api/import-repo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface ImportRepoResponse {
  files?: string[];
  error?: string;
}

const fetchRepoContents = async (owner: string, repo: string, path = '') => {
  const contents: string[] = [];
  const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
  for (const item of data) {
    if (item.type === 'file') {
      contents.push(item.path);
    } else if (item.type === 'dir') {
      const dirContents = await fetchRepoContents(owner, repo, item.path);
      contents.push(...dirContents);
    }
  }
  return contents;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImportRepoResponse>
) {
  if (req.method === 'POST') {
    const { repoUrl } = req.body;

    if (typeof repoUrl !== 'string') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Extract the owner and repo name from the URL
    const match = repoUrl.match(/https:\/\/github.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid repository URL' });
    }
    const [, owner, repo] = match;

    try {
      // Fetch the list of files and folders from the repository
      const repoContents = await fetchRepoContents(owner, repo);
      return res.status(200).json({ files: repoContents });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to import repository' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
