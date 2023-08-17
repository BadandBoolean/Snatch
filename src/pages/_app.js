import "../styles/globals.css";
import { ConfigProvider } from "antd/lib";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DevelopmentAlert from "../components/DevelopmentAlert";

export default function App({ Component, pageProps }) {
  return (
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
  );
}

export { reportWebVitals } from "next-axiom";
