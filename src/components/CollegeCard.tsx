import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, IndianRupee, BookOpen, Building2 } from "lucide-react";
import { type College, type MatchLabel, getMatchLabel } from "@/data/colleges";
import { cn } from "@/lib/utils";

interface CollegeCardProps {
  college: College;
  studentPercentile: number;
  stream: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i - 0.5 <= rating
              ? "fill-yellow-200 text-yellow-400"
              : "fill-muted text-muted-foreground"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

const matchConfig: Record<MatchLabel, { label: string; className: string }> = {
  Safe: {
    label: "Safe",
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  },
  "Good Match": {
    label: "Good Match",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Reach: {
    label: "Reach",
    className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

export function CollegeCard({ college, studentPercentile, stream }: CollegeCardProps) {
  const match = getMatchLabel(studentPercentile, college.minPercentile);
  const config = matchConfig[match];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-base leading-tight">{college.name}</h3>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                  config.className
                )}
              >
                {config.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {college.location}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                {stream}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {college.type}
              </span>
            </div>

            <div className="mt-3">
              <StarRating rating={college.rating} />
            </div>
          </div>

          {/* Right: Fees + Percentile */}
          <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 sm:items-end sm:text-right shrink-0">
            <div>
              <p className="text-xs text-muted-foreground">Annual Fees</p>
              <p className="flex items-center gap-0.5 font-semibold text-foreground sm:justify-end">
                <IndianRupee className="h-3.5 w-3.5" />
                {college.fees >= 1 ? `${college.fees}L` : `${(college.fees * 100).toFixed(0)}K`}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Min. Percentile</p>
              <p className="font-semibold text-foreground">{college.minPercentile}th</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
