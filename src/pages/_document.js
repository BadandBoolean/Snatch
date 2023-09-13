import { Html, Head, Main, NextScript } from "next/document";
import { AxiomWebVitals } from "next-axiom";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="icon" href="/favicon.png" />

      <AxiomWebVitals />
      <Head>
        <meta
          property="og:title"
          content="Snatch: Book a last-minute appointment"
        />
        <meta
          property="og:image"
          content="https://wearesnatch.vercel.app/ogimg1.png"
        />
        <meta property="description" content="Snatch: Book an appointment." />
        <meta
          property="og:description"
          content="Book a last-minute appointment at your favorite salon"
        />
        <meta property="og:url" content="https://wearesnatch.vercel.app" />
      </Head>
      <title>Snatch</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
