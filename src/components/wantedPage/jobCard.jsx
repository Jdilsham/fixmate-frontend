import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { MapPin, Briefcase, Users } from "lucide-react";

export default function JobCard({ id, profession, description, location, requiredCount, currentJoined, onApply, isProvider ,isApplied , handleViewDetails }) {
  const isFull = currentJoined >= requiredCount;

  return (
    <Card className="w-full max-w-5xl mx-auto rounded-3xl border border-border bg-card/65 dark:bg-card/45 backdrop-blur-md shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Wanted <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{profession}</span>
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Recruitment for {requiredCount} project members
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1.5 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" /> <span>{location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Progress</span>
              <span className="text-xs font-bold text-primary">{currentJoined} / {requiredCount} Joined</span>
            </div>
            <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentJoined/requiredCount)*100}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <div className="w-full flex justify-between items-center">
          <p className="text-l text-muted-foreground">{isFull ? "This project is full." : "Sign up if you are interested."}</p>
          {isProvider && (
            <div className="flex gap-3">
            
            <Button variant="fixmate" className="px-6 h-11 rounded-2xl" disabled={isFull || isApplied} onClick={() => onApply(id)}>
              {isFull ? "Filled" : isApplied ? "Already Applied" : "Sign Up for Work"}
            </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}