export function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
