import Image from "next/image";

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
      <Image
        src="/images/Logótipo FRONEX Branco com Angola.png"
        alt="Logo completa Fronex com a insígnia de Angola"
        width={64}
        height={64}
        sizes="(min-width: 640px) 64px, 56px"
        priority
        className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
      />
      <span className={`sr-only ${textClassName}`}>
        Fronex
      </span>
    </span>
  );
}
