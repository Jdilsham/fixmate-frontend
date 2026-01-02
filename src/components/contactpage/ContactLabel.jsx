export default function ContactLabel({ text }) {
  return (
    <label className="text-sm font-medium text-foreground block mb-1">
      {text}
    </label>
  );
}
