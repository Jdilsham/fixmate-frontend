import { Button } from "@/components/ui/button";

export default function StepProfessionalInfo({
  data,
  onChange,
  onNext,
}) {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">
          Professional Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your skills and experience
        </p>
      </div>

      {/* Form Card */}
      <div className="space-y-5">

        {/* Skill */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Skill
          </label>
          <input
            value={data.skill}
            onChange={(e) =>
              onChange({ ...data, skill: e.target.value })
            }
            className="
              w-full rounded-xl border
              px-4 py-2.5
              bg-background
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
              transition
            "
            placeholder="Electrician"
          />
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Experience
          </label>
          <input
            value={data.experience}
            onChange={(e) =>
              onChange({ ...data, experience: e.target.value })
            }
            className="
              w-full rounded-xl border
              px-4 py-2.5
              bg-background
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
              transition
            "
            placeholder="5 years"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Description
          </label>
          <textarea
            rows={4}
            value={data.description}
            onChange={(e) =>
              onChange({ ...data, description: e.target.value })
            }
            className="
              w-full rounded-xl border
              px-4 py-3
              bg-background
              resize-none
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
              transition
            "
            placeholder="Experienced electrician specializing in home wiring"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={onNext}
          disabled={!data.skill || !data.experience || !data.description}
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
