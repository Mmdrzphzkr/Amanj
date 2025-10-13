// Filename: src/app/dashboard/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

const DRAWER_WIDTH = 240;
const APP_BAR_Z_INDEX = 1300; // Define a static zIndex value

const navItems = [
  { text: "داشبورد", href: "/dashboard" },
  { text: "محصولات", href: "/dashboard/products" },
  { text: "دسته بندی ها", href: "/dashboard/categories" },
  { text: "برندها", href: "/dashboard/brands" },
  { text: "سفارشات", href: "/dashboard/orders" },
];

export default async function DashboardLayout({ children }) {
  const cookieStore = cookies(); 
  const token = await cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: APP_BAR_Z_INDEX }} // Use the static value
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            داشبورد فروشگاه
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

