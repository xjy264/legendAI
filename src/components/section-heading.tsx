import Link from "next/link";

export function SectionHeading({
  kicker,
  title,
  description,
  kickerClassName = "text-emerald-700",
  titleClassName = "text-slate-950",
  descriptionClassName = "text-slate-600",
  actionLabel,
  actionHref,
}: {
  kicker?: string;
  title: string;
  description?: string;
  kickerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="max-w-3xl">
      {kicker ? (
        <p className={`mb-3 text-xs font-semibold tracking-[0.28em] uppercase ${kickerClassName}`}>
          {kicker}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${titleClassName}`}>
          {title}
        </h2>
        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-slate-500 uppercase transition hover:border-emerald-200 hover:text-emerald-700"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {description ? <p className={`mt-3 text-sm leading-7 ${descriptionClassName}`}>{description}</p> : null}
    </div>
  );
}
