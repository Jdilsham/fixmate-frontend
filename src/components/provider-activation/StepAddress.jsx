import { Button } from "@/components/ui/button";

export default function StepAddress({
  data,
  onChange,
  onNext,
  hasAddress,
}) {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">
          Service Location
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your service location so customers can find you easily.
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Input
          label="Address Line 1"
          placeholder="No. 10, Galle Road"
          value={data.addressLine1}
          onChange={(e) =>
            onChange({ ...data, addressLine1: e.target.value })
          }
        />

        <Input
          label="Address Line 2"
          placeholder="Near Clock Tower"
          value={data.addressLine2}
          onChange={(e) =>
            onChange({ ...data, addressLine2: e.target.value })
          }
        />

        <Input
          label="Province"
          placeholder="Southern Province"
          value={data.province}
          onChange={(e) =>
            onChange({ ...data, province: e.target.value })
          }
        />

        <Input
          label="City"
          placeholder="Galle"
          value={data.city}
          onChange={(e) =>
            onChange({ ...data, city: e.target.value })
          }
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t">

        <span className="text-xs text-muted-foreground">
          {hasAddress
            ? "Updating your existing address"
            : "Adding a new service address"}
        </span>

        <Button
          onClick={onNext}
          disabled={!data.addressLine1 || !data.province || !data.city}
          className="
            px-6
            bg-orange-500
            hover:bg-orange-600
            text-white
            disabled:bg-orange-300
          "
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
}

/* Reusable input */
function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full rounded-xl border
          px-4 py-2.5
          bg-background
          focus:outline-none
          focus:ring-2 focus:ring-orange-500/40
          transition
        "
      />
    </div>
  );
}
