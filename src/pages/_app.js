import "../styles/globals.css";
import styles from "../styles/ErrorSignUp.module.css";
import Image from "next/image";
import { ConfigProvider } from "antd/lib";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DevelopmentAlert from "../components/DevelopmentAlert";
import { ErrorBoundary } from "react-error-boundary";
// todo: add logging when error shows in error boundary.

function Fallback({ error, resetErrorBoundary }) {
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
          <DevelopmentAlert />
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </ConfigProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export { reportWebVitals } from "next-axiom";
