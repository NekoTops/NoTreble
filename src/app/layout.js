import { Geist, Geist_Mono } from "next/font/google";
import styles from "./globals.css";
import "./globals.css";
import NavBar from "./component/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NoTreble",
  description: "Generated by create next app [CHANGE ME]",
};

function Header() {
  return (
    <>
    {/* TODO: Add Logo :) */}
      <NavBar className="nav-bar"/>
    </>
  )
}
//update
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
