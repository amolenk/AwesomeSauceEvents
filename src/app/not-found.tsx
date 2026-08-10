import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#14213f", color: "white" }} className="d-flex flex-column align-items-center justify-content-center text-center p-4">
      <img src="/img/logo.png" alt="Awesome Sauce Events" style={{ height: 175, marginBottom: 32 }} />
      <h1 style={{ textTransform: "uppercase" }}>Event Not Found</h1>
      <p className="lead mt-3">We couldn&apos;t find that event.</p>
      <p>Please use the registration link provided for your event.</p>
      <Link href="/" className="visually-hidden">Home</Link>
    </div>
  );
}
