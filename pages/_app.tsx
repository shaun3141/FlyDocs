import type { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import { Ubuntu } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    typography: {
      fontFamily: `${ubuntu.style.fontFamily}, Arial`,
    },
    palette: {
      primary: {
        main: "#333",
      },
      secondary: {
        main: "#eee",
      },
    },
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>

        <meta property="og:title" content="FlyDocs" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://FlyDocs" />
        <meta property="og:site_name" content="FlyDocs" />
        <meta
          property="og:description"
          content="FlyDocs | Write your Best Message Effortlessly."
        />
        <meta property="og:image" content="https://FlyDocs/10x_circle.png" />

        <title>FlyDocs</title>
        <meta
          name="description"
          content="FlyDocs | Write your Best Message Effortlessly."
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}
