export default function ContactTextarea({
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <textarea
      name={name}
      rows="4"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-accent bg-background resize-none"
      required
    />
  );
}
