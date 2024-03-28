import "../styles/globals.css";
import styles from "../styles/ErrorSignUp.module.css";
import Image from "next/image";
import { ConfigProvider } from "antd/lib";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ErrorBoundary } from "react-error-boundary";
import { Analytics } from "@vercel/analytics/react";

import { useLogger } from "next-axiom";

function Fallback({ error, resetErrorBoundary }) {
  const logger = useLogger();
  logger.error("Error boundary error hit!", { error });

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div
          className={styles.unauthtext}
          style={{ fontWeight: "700", fontSize: "1.5em" }}
        >
          Oops! Something went wrong! Please refresh the page or try again
          later.
        </div>
        <div className={styles.unauthimage}>
          <Image src="/errorimg2.png" alt="error500" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <SessionProvider session={pageProps.session}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#4831D4",
            },
          }}
        >
          {Component.name !== "OwnerHome" && <NavBar />}
          <Component {...pageProps} />
          <Analytics />
          <Footer />
        </ConfigProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export { reportWebVitals } from "next-axiom";
