export default function AvailabilityToggle({
  isAvailable,
  canToggle,
  onToggle,
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        disabled={!canToggle}
        onClick={onToggle}
        className={`
          relative w-14 h-7 rounded-full transition
          ${isAvailable ? "bg-green-500" : "bg-gray-300"}
          ${!canToggle ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full
            transition-transform
            ${isAvailable ? "translate-x-7" : "translate-x-0"}
          `}
        />
      </button>

      <span className="text-sm text-muted-foreground">
        {isAvailable ? "Available" : "Unavailable"}
      </span>
    </div>
  );
}
