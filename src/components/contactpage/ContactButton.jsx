import { Button } from "@/components/ui/button";

export default function ContactButton({ text, loading }) {
  return (
    <Button
      type="submit"
      variant="fixmate"
      size="lg"
      disabled={loading}
      className="w-full rounded-2xl"
    >
      {loading ? "Sending..." : text}
    </Button>
  );
}