import { Html, Head, Main, NextScript } from "next/document";
import { AxiomWebVitals } from "next-axiom";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="icon" href="/favicon.png" />
      <AxiomWebVitals />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
