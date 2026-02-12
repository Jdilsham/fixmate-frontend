export default function ContactButton({ text, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
    >
      {loading ? "Sending..." : text}
    </button>
  );
}