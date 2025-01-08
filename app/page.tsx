import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-bold">Notes App</h1>
        <p className="text-2xl">
          A simple notes app built with Next.js and Tailwind CSS.
        </p>
        <Link href={"/drag"} className="text-[100px] bg-red-500 p-10 rounded-lg">Go to notes Todo app</Link>
      </main>
    </div>
  );
}
