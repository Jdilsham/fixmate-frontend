export default function AddServiceCard({ profile, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        w-full max-w-[280px] h-[400px]
        bg-muted-foreground/10
        border-2 border-dashed border-primary/40
        rounded-2xl p-6 flex flex-col
        cursor-pointer hover:shadow-xl
      "
    >
      <div className="flex items-center gap-4 h-[72px]">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
          {profile.profilePic
            ? <img src={profile.profilePic} className="w-full h-full object-cover rounded-full" />
            : profile.fullName?.charAt(0)}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{profile.fullName}</h3>
          <span className="text-sm text-muted-foreground">Add new service</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <div className="text-5xl">+</div>
        <p className="text-sm mt-2">Click to add service</p>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>📍 {profile.city}</span>
        <span className="text-primary">New</span>
      </div>
    </div>
  );
}
