import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Message } from '../../types/chat';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ReactMarkdown from 'react-markdown';
import { getLanguageFromFilename } from '../../utils/render/getLang';
import { TypeAnimation } from 'react-type-animation';
import { convertURLsToMarkdownLinks } from '../../utils/render/textUtils';
import { customComponents } from '../../utils/render/markdownLink';

interface SourceDocument {
  filename: string;
  content: string;
}

const GitHubRepoImporter = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);
  const [infoFetched, setInfoFetched] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [repoFiles, setRepoFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [namespace, setNamespace] = useState<string | null>(null);
  const [ingestComplete, setIngestComplete] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: SourceDocument[];
  }>({
    messages: [
      {
        message: 'Hello, AskGit at your service! Please enter a GitHub repository URL. I will do my best to anwser any questions.',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const viewSourceDocument = (sourceDoc: SourceDocument) => {
    if (!sourceDoc.filename || !sourceDoc.content) {
      console.log('Source document information is missing.');
      return;
    }
    setSelectedFile(sourceDoc.filename);
    setSelectedFileContent(sourceDoc.content);
    const fileContentElement = document.getElementById('selected-file-content');
    fileContentElement?.scrollIntoView({ behavior: 'smooth' });
  };


  const fetchFileContent = async (owner: string, repo: string, filePath: string) => {
    try {
      // Construct the correct URL for fetching file content
      const fileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${filePath}`;
      console.log(`Fetching file content from URL: ${fileUrl}`);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        // Add the error message as a chatbot response
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: `Failed to fetch file content. Status: ${response.status}`,
            },
          ],
        }));
        return;
      }
      const fileContent = await response.text();
      // Set the fetched file content to the selectedFileContent state variable
      setSelectedFileContent(fileContent);
    } catch (error) {
      console.error(`Error fetching file content: ${error}`);
      // Add the error message as a chatbot response
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'An error occurred while fetching file content. Please try again.',
          },
        ],
      }));
    }
  };


  const importRepo = async () => {
    console.log('Importing repository with URL:', repoUrl);
    setIsLoading(true);
    setSuccess(false);
    // Extract owner and repo name from the GitHub URL using a regular expression
    const githubUrlPattern = /https:\/\/github.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(githubUrlPattern);
    if (!match) {
      // Add the error message as a chatbot response
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'Invalid GitHub URL',
          },
        ],
      }));
      setIsLoading(false);
      return;
    }
    const owner = match[1];
    const repo = match[2];
    // Call the ingest endpoint to process the repository and send it to Pinecone
    const ingestSuccess = await handleGithubSubmit(repoUrl);
    // If ingestion is successful, proceed with the import
    if (ingestSuccess) {
      try {
        const response = await fetch('/api/import-repo', {
          method: 'POST',
          body: JSON.stringify({ repoUrl }),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Import repo response:', response);
        if (response.ok) {
          const data = await response.json();
          console.log('Import repo data:', data);
          setRepoFiles(data.files);
          setSuccess(true);
          setSelectedFile(null);
          // Set the extracted owner and repo name to state
          setOwner(owner);
          setRepo(repo);
        } else {
          // Add the error message as a chatbot response
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'apiMessage',
                message: 'Failed to import repository',
              },
            ],
          }));
        }
      } catch (error) {
        // Add the error message as a chatbot response
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: 'An error occurred while importing the repository. Please try again.',
            },
          ],
        }));
        console.error('Error importing repository:', error);
      }
    }
    setIsLoading(false);
  };


  const handleGithubSubmit = async (githubUrl: string) => {
    setIngestComplete(false);
    if (!githubUrl) {
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'Please input a GitHub URL',
          },
        ],
      }));
      return false;
    }
    setFetching(true);
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUrl,
        }),
      });
      const data = await response.json();
      const namespace = data.namespace;
      setNamespace(namespace);
      if (data.error) {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.error,
            },
          ],
        }));
        setFetching(false);
        return false;
      } else {
        setInfoFetched(true);
        setIngestComplete(true);
        setConfirm('Ingestion complete');
        setFetching(false);
        return true;
      }
    } catch (error) {
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'An error occurred while fetching the data. Please try again.',
          },
        ],
      }));
      setFetching(false);
      console.log('error', error);
      return false;
    }
  };


  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!query) {
      // Add the error message as a chatbot response
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'Please input a question',
          },
        ],
      }));
      return;
    }
    const question = query.trim();
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));
    setLoading(true);
    setQuery('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          githubUrl,
          namespace,
        }),
      });
      const data = await response.json();
      console.log('data', data);
      if (data.error) {
        // Add the error message as a chatbot response
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.error,
            },
          ],
        }));
      } else {
        // Extract the filename and content from the sourceDocuments property
        const sourceDocs = data.sourceDocuments.map((doc: any, index: number) => ({
          filename: doc.metadata.source || `Source${index}`,
          content: doc.pageContent,
        }));
        console.log('sourceDocs:', sourceDocs);
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);
      setLoading(false);
      //scroll to bottom
      lastMessageRef.current?.scrollTo(0, lastMessageRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      // Add the error message as a chatbot response
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: 'An error occurred while fetching the data. Please try again.',
          },
        ],
      }));
      console.log('error', error);
    }
  }


  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);


  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

return (
  <div className="flex flex-col text-black md:flex">
    <div className="flex-grow rounded-lg bg-gray-50 px-2 py-4 md:px-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          <div className="md:col-span-2 max-w-[90vw] justify-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Import a GitHub Repository</h2>
              <div className="flex items-center space-x-2 md:space-x-4 mb-4 md:mb-6">
                  <input
                    type="text"
                    placeholder="Enter GitHub repo URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="flex-grow border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-md px-2 md:px-4 py-2"
                  />
                  <button
                    onClick={() => importRepo()}
                    disabled={isLoading || fetching}
                    className={`inline-flex items-center px-2 md:px-4 py-2 border border-transparent shadow-sm text-sm md:text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ${
                      (isLoading || fetching) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {(isLoading || fetching) ? 'Importing...' : 'Import Repo'}
                  </button>
                </div>
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 overflow-auto max-h-[636px]">
              {!success && (
                <div className="bg-yellow-100 border-yellow-500 border-2 rounded-lg px-4 py-2 mb-4 text-center">
                  📝 Please enter a GitHub repository URL to get started.
                </div>
              )}
              {success && confirm && (
                <div className="bg-green-100 border-green-500 border-2 rounded-lg px-4 py-2 mb-4 text-center">
                  ✅ Repository imported successfully.
                </div>
              )}
              {repoFiles.length > 0 && (
                <>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Repository Contents</h3>
                  <select
                    value={selectedFile ?? ''}
                    onChange={(e) => {
                      const filePath = e.target.value;
                      setSelectedFile(filePath);
                      // Check if owner, repo, and filePath are not null before calling fetchFileContent
                      if (owner && repo && filePath) {
                        fetchFileContent(owner, repo, filePath);
                      }
                    }}
                    className="w-full mb-2 md:mb-4 bg-white border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-md px-2 md:px-4 py-2"
                  >
                    <option value="">Select a file</option>
                    {repoFiles.map((file, index) => (
                      <option key={index} value={file}>
                        {file}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {selectedFile && selectedFileContent && (
                <div className="mt-4 max-h-[22rem] overflow-y-scroll" id="selected-file-content">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">
                    {selectedFile}
                  </h3>
                  <SyntaxHighlighter language={getLanguageFromFilename(selectedFile)} style={prism}>
                    {selectedFileContent}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </div>
          <main className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-white shadow-md rounded-md p-4 w-full max-w-[90vw]">
                <div ref={lastMessageRef} className="overflow-y-auto h-[70vh]">
                  {messages.map((message, index) => {
                    let icon;
                    let className;
                    let justifyContent;
                    let flexOrder;
                    if (message.type === 'apiMessage') {
                      icon = (
                        <Image
                          key={index}
                          src="/bot.png"
                          alt="AI"
                          width="40"
                          height="40"
                          className="mx-2"
                          priority
                        />
                      );
                      className = "flex items-center p-2 bg-blue-100 rounded-md mb-2";
                      justifyContent = "justify-start";
                      flexOrder = "flex-row";
                    } else {
                      icon = (
                        <Image
                          key={index}
                          src="/user.png"
                          alt="Me"
                          width="30"
                          height="30"
                          className="mx-2"
                          priority
                        />
                      );
                      className = loading && index === messages.length - 1
                        ? "flex items-center p-2 bg-green-100 rounded-md mb-2 animate-pulse"
                        : "flex items-center p-2 bg-green-100 rounded-md mb-2";
                      justifyContent = "justify-end";
                      flexOrder = "flex-row-reverse";
                    }
                    const processedMessage = convertURLsToMarkdownLinks(message.message);
                    return (
                      <div
                        key={`chatMessage-${index}`}
                        className={`flex ${justifyContent} mb-2`}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                      >
                        <div className={`${className} ${flexOrder}`}>
                          {icon}
                          <div className="flex-1">
                            {message.type === 'apiMessage' ? (
                              <TypeAnimation
                                sequence={[processedMessage]}
                                cursor={index === messages.length - 1} // Show cursor only for the last bot message
                                repeat={0}
                                style={{ display: 'inline-block' }}
                              >
                                <ReactMarkdown components={customComponents} linkTarget="_blank">
                                  {processedMessage}
                                </ReactMarkdown>
                                {message.sourceDocs &&
                                  message.sourceDocs.length > 0 &&
                                  message.sourceDocs.map((sourceDoc: SourceDocument, docIndex) => (
                                    <button
                                      key={`sourceDoc-${docIndex}`}
                                      onClick={() => viewSourceDocument(sourceDoc)}
                                      className="bg-blue-500 mx-1 hover:bg-blue-600 text-white rounded-md p-1 mt-2"
                                    >
                                      {sourceDoc.filename}
                                    </button>
                                ))}
                              </TypeAnimation>
                            ) : (
                              <ReactMarkdown components={customComponents} linkTarget="_blank">
                                {processedMessage}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              <div className="w-full">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <textarea
                    disabled={!ingestComplete || loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response...'
                        : 'How do i get started?'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="submit"
                    disabled={!ingestComplete || loading}
                    className={`rounded-md p-2 text-white ${
                      !ingestComplete || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Send
                  </button>
                </form>
              </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitHubRepoImporter;