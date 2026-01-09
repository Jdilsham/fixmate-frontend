import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function ProfessionalCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-3xl">
            J
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-semibold">Kavindu Jayashan</h2>
            <p className="text-lg text-muted-foreground">
              Professional Plumber
            </p>
            <span className="text-sm opacity-70">  Galle, Sri Lanka</span>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-4">
          <p className="text-base leading-relaxed opacity-80">
            Certified plumber specializing in home repairs, water line repairs, and fault diagnosis.
          </p>
        </div>

        <div className="flex justify-end">
          <Button className="min-w-[160px]">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
