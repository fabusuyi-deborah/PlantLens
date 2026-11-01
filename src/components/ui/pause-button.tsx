import { Pause, Play } from "lucide-react";

/** Round pause/play toggle for anything that moves on its own (WCAG 2.2.2). */
export function PauseButton({
  paused,
  onToggle,
  what,
  className = "",
}: {
  paused: boolean;
  onToggle: () => void;
  /** What it controls, read out as "Pause photos" / "Play photos". */
  what: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={`${paused ? "Play" : "Pause"} ${what}`}
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-paper/80 text-paper transition-colors hover:bg-paper hover:text-green ${className}`}
    >
      {paused ? (
        <Play className="size-3.5 fill-current" aria-hidden />
      ) : (
        <Pause className="size-3.5 fill-current" aria-hidden />
      )}
    </button>
  );
}
