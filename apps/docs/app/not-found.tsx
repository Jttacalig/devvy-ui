import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <h1>That page is still a blank canvas.</h1>
      <p>Find your way back to the foundation.</p>
      <Link href="/ui">Go to DEVVY UI →</Link>
    </main>
  );
}
