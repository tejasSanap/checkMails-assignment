import { Inter } from "next/font/google";
import "./globals.css";
import { SessProvider } from "@/components/SessProvider";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessProvider>{children} </SessProvider>
        <Toaster />
      </body>
    </html>
  );
}