export default function ContactInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-accent bg-background"
      required
    />
  );
}
