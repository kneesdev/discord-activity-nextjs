import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1d1d21] text-zinc-200">
        {children}
      </body>
    </html>
  );
}
