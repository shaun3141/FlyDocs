import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
const nav_text = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  { name: "Demo", url: "/demo", openInNewTab: false },
  { name: "Coolness", url: "/security", openInNewTab: false },
];

export default function Navbar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", fontFamily: nav_text.style }}
    >
      <Link
        href="/"
        style={{ textDecoration: "none", color: "inherit" }}
        passHref
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: nav_text.style,
          }}
        >
          <span style={{ color: "red" }}>Fly</span>Docs
        </Typography>
      </Link>
      <Divider />
      <List>
        {navItems.map((item, idx) => (
          <Link
            key={item.url}
            href={item.url}
            target={item.openInNewTab ? "_blank" : "_self"}
            style={{ textDecoration: "none", color: "inherit" }}
            passHref
          >
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText
                  primary={item.name.toUpperCase()}
                  sx={{ fontFamily: nav_text.style }}
                />
              </ListItemButton>
            </ListItem>
            {idx !== navItems.length - 1 && (
              <Divider style={{ width: "60%", margin: "0 auto" }} />
            )}
          </Link>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar sx={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
            passHref
          >
            <Typography
              variant="h6"
              sx={{
                display: { xs: "block", sm: "none" },
                fontFamily: nav_text.style,
                color: "inherit",
                textDecoration: "inherit",
                fontSize: "2.5rem",
              }}
            >
              <span style={{ color: "red" }}>Fly</span>Docs
            </Typography>
          </Link>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
              },
              fontFamily: nav_text.style,
            }}
          >
            <Link
              href="/"
              style={{
                color: "inherit",
                textDecoration: "inherit",
                fontSize: "2.5rem",
              }}
              passHref
            >
              <span style={{ color: "red" }}>Fly</span>Docs
            </Link>
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, idx) => (
              <>
                <Link
                  key={item.url}
                  href={item.url}
                  target={item.openInNewTab ? "_blank" : "_self"}
                  style={{
                    textDecoration: "none",
                    color: item.color || "inherit",
                  }}
                >
                  <Button
                    sx={{
                      color: item.color || "inherit",
                      fontFamily: nav_text.style,
                      fontSize: "1.5rem",
                    }}
                  >
                    {item.name}
                  </Button>
                </Link>
                {idx < navItems.length - 1 && (
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "2px",
                      backgroundColor: "#fff",
                      height: "30px",
                      verticalAlign: "middle",
                    }}
                  ></Box>
                )}
              </>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Push content below app bar */}
      <Box sx={{ height: "60px" }}></Box>
    </Box>
  );
}
