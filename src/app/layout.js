import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Your Company Name | AI Chat Assistant",
  description: "Get instant answers to your questions with our AI-powered chatbot. Available 24/7 to assist you with product information, support, and more.",
  keywords: "AI chatbot, customer support, virtual assistant",
  openGraph: {
    title: "AI Chat Assistant",
    description: "Interactive AI chatbot for instant support",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
