import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags for SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta name="keywords" content="GitHub, AI, ChatBot" />
        <meta name="author" content="BankkRoll" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.askgit.live" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="title" content="AskGit" />

        <meta property="og:title" content="AskGit" />
        <meta property="og:description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta property="og:url" content="https://www.askgit.live" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AskGit" />
        <meta property="og:image" content="https://www.askgit.live/example.jpg" />
        <meta name="twitter:image" content="https://www.askgit.live/example.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AskGit" />
        <meta name="twitter:description" content="Learn about code, development, documentation, and anything else you can imagine. Instant GitHub knowledge at your fingertips." />
        <meta name="twitter:site" content="@bankkroll_eth" />
        <meta property="twitter:url" content="https://www.askgit.live/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
