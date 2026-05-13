import { Button } from "@/components/ui/button";

export default function StepDocuments({
  idFrontFile,
  idBackFile,
  workPdf,
  setIdFrontFile,
  setIdBackFile,
  setWorkPdf,
  onSubmit,
}) {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">
          Verification Documents
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload identity documents and work proof for verification.
        </p>
      </div>

      {/* Upload blocks */}
      <div className="space-y-6">
        <UploadBlock
          label="ID Card – Front"
          accept="image/*"
          file={idFrontFile}
          onChange={setIdFrontFile}
        />

        <UploadBlock
          label="ID Card – Back"
          accept="image/*"
          file={idBackFile}
          onChange={setIdBackFile}
        />

        <UploadBlock
          label="Work Proof (PDF)"
          accept="application/pdf"
          file={workPdf}
          onChange={setWorkPdf}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={onSubmit}
          disabled={!idFrontFile || !idBackFile || !workPdf}
          className="
            px-6
            bg-orange-500
            hover:bg-orange-600
            text-white
            disabled:bg-orange-300
          "
        >
          Activate Account
        </Button>
      </div>
    </div>
  );
}

/* Upload block */
function UploadBlock({ label, accept, file, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <div
        className="
          flex items-center gap-3
          rounded-xl border
          px-4 py-3
          bg-background
          transition
          hover:border-orange-400
        "
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="block w-full text-sm
            file:mr-3 file:rounded-md file:border-0
            file:bg-muted file:px-3 file:py-2
            file:text-xs file:font-medium
            hover:file:bg-muted/70
            cursor-pointer"
        />
      </div>

      {file && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          ✓ {file.name}
        </p>
      )}
    </div>
  );
}
