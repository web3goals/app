import { Head, Html, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="Web3 Goals - A social space that helps people and  communities to achieve their goals!"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
