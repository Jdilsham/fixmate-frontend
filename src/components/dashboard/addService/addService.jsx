export default function AddServiceCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        w-full max-w-[320px]
        h-[420px]
        rounded-2xl
        border-2 border-dashed border-white/40
        bg-[#2f5d7c]
        flex items-center justify-center
        cursor-pointer
        transition-all duration-300
        hover:border-white
        hover:shadow-xl
        hover:scale-[1.02]
      "
    >
      <div className="flex flex-col items-center text-center gap-4">
        
        {/* Plus Icon */}
        <div className="
          w-16 h-16
          rounded-full
          bg-white/20
          flex items-center justify-center
          text-3xl font-light
          transition
          group-hover:scale-110
        ">
          +
        </div>

        {/* Title */}
        <p className="text-lg font-semibold text-white">
          Add new service
        </p>

        {/* Subtitle */}
        <p className="text-sm text-white/70">
          Click to add service
        </p>
      </div>
    </div>
  );
}
