import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#14213f", color: "white" }} className="d-flex flex-column align-items-center justify-content-center text-center p-4">
      <Image src="/img/logo.png" alt="Awesome Sauce Events" width={143} height={175} style={{ marginBottom: 32 }} />
      <h1 style={{ textTransform: "uppercase" }}>Event Not Found</h1>
      <p className="lead mt-3">We couldn&apos;t find that event.</p>
      <p>Please use the registration link provided for your event.</p>
      <Link href="/" className="visually-hidden">Home</Link>
    </div>
  );
}
