"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const DRAWER_WIDTH = 240;

const navItems = [
  { text: "داشبورد", href: "/dashboard" },
  { text: "درخواست های سرویس", href: "/dashboard/reservations" },
  { text: "محصولات", href: "/dashboard/products" },
  { text: "دسته بندی ها", href: "/dashboard/categories" },
  { text: "برندها", href: "/dashboard/brands" },
  { text: "سفارشات", href: "/dashboard/orders" },
];

export default function DashboardShell({ children }) {
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH }} role="presentation">
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => { router.push(item.href); if (!isMdUp) setMobileOpen(false); }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            داشبورد فروشگاه
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Permanent drawer on md+, temporary on mobile */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
        {isMdUp ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
