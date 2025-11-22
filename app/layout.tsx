import type { Metadata } from "next";
import "../src/index.css"; // Import global CSS from the old CRA project
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
    <html lang="en">
      <body>
        <FlowFitProvider>{children}</FlowFitProvider>
      </body>
    </html>
  );
}
