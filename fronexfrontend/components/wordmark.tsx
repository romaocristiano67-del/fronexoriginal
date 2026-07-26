interface WordmarkProps {
  className?: string;
  textClassName?: string;
}

export default function Wordmark({
  className = "",
  textClassName = "",
}: WordmarkProps) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <span
        className={`font-display text-xl font-extrabold uppercase tracking-[0.38em] text-ink drop-shadow-[0_10px_22px_rgba(15,23,42,0.12)] ${textClassName}`}
      >
        Fron<span className="relative inline-block pr-[0.03em] text-accent">e<span className="absolute left-[0.08em] right-[0.05em] top-[0.48em] h-[0.12em] bg-surface" /></span>x
      </span>
    </span>
  );
}
