// utils/textUtils.ts

export function convertURLsToMarkdownLinks(text: string) {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  
    return text.replace(urlPattern, (url) => {
      return `[${url}](${url})`;
    });
  }