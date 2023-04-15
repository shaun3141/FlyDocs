import Link from "next/link";

import { AppBar, Toolbar, Typography } from "@mui/material";

const Footer = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="body1" color="inherit">
          <span style={{ color: "#08D2EA", fontWeight: "bold" }}>Fly</span>Docs
          | ©{new Date().getFullYear()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
