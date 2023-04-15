import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { Ubuntu } from "next/font/google";
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["300", "400", "700"] });

import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          width: "95%",
          maxWidth: "1100px",
          margin: "0 auto",
          fontFamily: ubuntu.style,
          padding: "1rem 0",
        }}
      >
        <Grid container spacing={2}>
          {children}
        </Grid>
        <Box sx={{ height: "100px" }} />
      </Box>
      <Footer />
    </>
  );
}
