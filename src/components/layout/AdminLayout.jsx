import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SideBarAdmin from "./sidebar/SideBarAdmin";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const navigate = useNavigate(); useEffect(() => {
    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) navigate("/login");

      // Get the current path
      const currentPath = window.location.pathname;      // Allow regular users to access account, payment history, my tickets, and event info
      const allowedPathsForUsers = [
        '/account',
        '/info-payment-event',
        '/my-tickets',
      ];

      // Check if the current path starts with any of the allowed paths
      const isAllowedForUsers = allowedPathsForUsers.some(path =>
        currentPath.startsWith(path)
      );

      // If regular user is trying to access other admin pages, redirect
      if (user.role === 0 && !isAllowedForUsers) {
        navigate("/");
      }
    };
    checkLogin();
  }, [navigate]);
  return (
    <Box display={"flex"}>
      <SideBarAdmin />
      <Box flex={1}>
        <Box minHeight={"100vh"}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default AdminLayout;
