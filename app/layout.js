"use client";

import "./globals.css";
import { AdminProvider } from "../components/admin-context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><AdminProvider>{children}</AdminProvider></body>
    </html>
  );
}
