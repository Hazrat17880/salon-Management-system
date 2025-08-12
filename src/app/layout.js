import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ToastContainer theme="colored" position="top-right"/>
        {children}</body>
    </html>
  );
}
