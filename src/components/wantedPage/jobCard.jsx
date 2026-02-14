import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MapPin, Briefcase } from "lucide-react";

export default function JobCard({ profession, description, location, contact }) {
  return (
    <Card className="w-full max-w-5xl mx-auto rounded-3xl border border-border bg-card/65 dark:bg-card/45 backdrop-blur-md shadow-xl overflow-hidden">
      {/* top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />


      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Wanted{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                {profession}
              </span>
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job request • Looking for a skilled professional
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground w-fit">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-[240px]">{location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-2xl border border-border/70 bg-muted/30 dark:bg-muted/20 p-4 sm:p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </span>
            {profession}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Tip: Click contact to reach the requester.
          </p>
          <Button
            variant="fixmate"
            className="w-full sm:w-auto px-6 h-11 rounded-2xl"
          >
            {contact}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}