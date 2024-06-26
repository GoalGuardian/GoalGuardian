import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Goal Guardian</title>
          {/* TODO: Generate an actual description */}
          <meta
            name="description"
            content="Goal Guardian is a hockey team management system"
          />
        </head>
        <body className="bg-purple-50">
          <Navbar />
          <div>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
