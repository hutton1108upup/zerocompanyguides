import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>This route is not part of the approved Zero Company guide map.</p>
      <p>
        Try the <Link href="/">homepage</Link> or jump to the <Link href="/walkthrough">walkthrough hub</Link>.
      </p>
    </main>
  );
}
