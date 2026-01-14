import { useNavigate } from "react-router-dom";



export default function EmployerCard({ employer }) {
  const navigate = useNavigate();

  // fallback if employer is undefined / null
  const data = employer ?? DUMMY_EMPLOYER;

  return (
    <div
      className="
        w-full max-w-[320px]
        h-[400px]
        bg-muted-foreground/10
        border border-border
        rounded-2xl
        p-6
        flex flex-col
        transition-shadow duration-300
        hover:shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-center gap-4 h-[72px]">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold overflow-hidden">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>
              {data.fullName?.charAt(0) ?? "?"}
            </span>
          )}
        </div>

        <div className="overflow-hidden">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {data.fullName}
            {data.isVerified && (
              <span className="ml-1 text-xs text-primary">✔</span>
            )}
          </h3>
          <span className="text-sm text-muted-foreground">
            {data.skill}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed h-[72px] line-clamp-3">
        {data.description}
      </p>

      <div className="flex-1" />

      {/* Footer */}
      <div className="h-[96px] flex flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>⭐ {data.rating}</span>
          <span>📍 {data.location}</span>
        </div>

        <button
          disabled={!employer}
          onClick={() => navigate(`/profile/${data.id}`)}
          className="
            w-full
            py-2.5
            rounded-xl
            bg-accent
            text-accent-foreground
            font-medium
            transition
            hover:brightness-110
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          View profile
        </button>
      </div>
    </div>
  );
}