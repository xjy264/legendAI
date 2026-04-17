import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 text-center">
      <div className="rounded-3xl border border-black/10 bg-white/75 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
          Not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          That page does not exist.
        </h1>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
