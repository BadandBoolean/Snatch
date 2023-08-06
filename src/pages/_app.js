import "../styles/globals.css";
import { ConfigProvider } from "antd/lib";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";

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
        <NavBar />
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
}
