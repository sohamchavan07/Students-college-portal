import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              CollegeMatch
            </h1>
            <p className="text-sm text-muted-foreground">Find Your Perfect College</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground max-w-xl">
            Enter your academic profile below and we'll match you with the best colleges — plus an AI-generated explanation personalised for you.
          </p>
        </div>
      </div>
    </header>
  );
}
