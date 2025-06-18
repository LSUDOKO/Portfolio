import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Head from "../components/Head";
import "../styles/globals.css";
import "../styles/themes.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Set Tokyo Night as default theme
      document.documentElement.setAttribute("data-theme", "tokyo-night");
      localStorage.setItem("theme", "tokyo-night");
    }
  }, []);

  return (
    <Layout>
      <Head title={`Arpit | Portfolio`} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
