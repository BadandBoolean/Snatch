import { Html, Head, Main, NextScript } from "next/document";
import { AxiomWebVitals } from "next-axiom";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="icon" href="/favicon.png" />

      <AxiomWebVitals />
      <Head>
        <title>Snatch</title>
        <meta property="og:title" content="Snatch" />
        <meta property="og:image" content="/ogimg.png" />
        <meta
          property="description"
          content="Snatch: Book somebody else's canceled appointment at your favorite salon."
        />
        <meta
          property="og:description"
          content="Book a last-minute appointment at your favorite salon"
        />
        <meta property="og:url" content="https://wearesnatch.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
