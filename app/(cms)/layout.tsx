export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="cms-container">
          {children}
        </div>
      </body>
    </html>
  )
}