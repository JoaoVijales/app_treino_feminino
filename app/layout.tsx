import type { Metadata } from "next";
import "./globals.css"; // Import global CSS for Tailwind
import { FlowFitProvider } from "../src/context/FlowFitContext"; // Import FlowFitProvider

export const metadata: Metadata = {
  title: "FlowFit App", // Updated title
  description: "Your personal fitness and menstrual cycle tracking app.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <FlowFitProvider>{children}</FlowFitProvider>
      </body>
    </html>
  );
}
