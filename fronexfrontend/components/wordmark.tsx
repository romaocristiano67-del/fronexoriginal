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
      <span className={`font-display text-sm font-semibold tracking-normal text-ink ${textClassName}`}>
        Fronex
      </span>
    </span>
  );
}
