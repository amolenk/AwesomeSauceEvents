'use client'

export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", backgroundColor: "#14213f", color: "white", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <h1 style={{ textTransform: "uppercase" }}>Something went wrong</h1>
          <p>Please try again later.</p>
        </div>
      </body>
    </html>
  );
}
