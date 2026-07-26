interface WordmarkProps {
  className?: string;
  textClassName?: string;
}

export default function Wordmark({
  className = "",
  textClassName = "",
}: WordmarkProps) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span
        className={`font-display text-xl font-black uppercase tracking-[0.34em] text-ink ${textClassName}`}
      >
        Fronex
      </span>
      <span className="mt-1 h-0.5 w-12 rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#22d3ee_100%)]" />
    </span>
  );
}
