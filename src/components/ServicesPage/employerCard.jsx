export default function EmployerCard({ employer }) {
  return (
    <div className="w-[280px] h-[346px] bg-white/30 backdrop-blur-md rounded-4xl p-4 flex flex-col items-center">
      <div className="w-[100px] h-[100px] bg-gray-300 rounded-full mb-4 mt-10"></div>
      <h3 className="text-xl font-bold text-black mb-1">{employer.name}</h3>
      <p className="text-black text-center">{employer.description}</p>
    </div>
  );
}
