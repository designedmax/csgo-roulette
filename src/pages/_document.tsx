import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 