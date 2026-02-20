import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { STREAMS, LOCATIONS, BUDGET_RANGES, type StudentProfile, type Stream, type BudgetRange } from "@/data/colleges";

interface StudentFormProps {
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

export function StudentForm({ onSubmit, isLoading }: StudentFormProps) {
  const [percentile, setPercentile] = useState("");
  const [stream, setStream] = useState<Stream | "">("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState<BudgetRange | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const pct = parseFloat(percentile);
    if (!percentile) newErrors.percentile = "Percentile is required";
    else if (isNaN(pct) || pct < 0 || pct > 100) newErrors.percentile = "Percentile must be between 0 and 100";
    if (!stream) newErrors.stream = "Please select a preferred stream";
    if (!location) newErrors.location = "Please select a preferred location";
    if (!budget) newErrors.budget = "Please select a budget range";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      percentile: parseFloat(percentile),
      stream: stream as Stream,
      location,
      budget: budget as BudgetRange,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Your Academic Profile</CardTitle>
        <CardDescription>Fill in your details to get personalised college recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Percentile */}
          <div className="space-y-1.5">
            <Label htmlFor="percentile">Percentile / Marks (0–100)</Label>
            <Input
              id="percentile"
              type="number"
              min={0}
              max={100}
              step={0.01}
              placeholder="e.g. 85.5"
              value={percentile}
              onChange={(e) => setPercentile(e.target.value)}
              className={errors.percentile ? "border-destructive" : ""}
            />
            {errors.percentile && (
              <p className="text-xs text-destructive">{errors.percentile}</p>
            )}
          </div>

          {/* Stream */}
          <div className="space-y-1.5">
            <Label>Preferred Stream</Label>
            <Select value={stream} onValueChange={(v) => setStream(v as Stream)}>
              <SelectTrigger className={errors.stream ? "border-destructive" : ""}>
                <SelectValue placeholder="Select stream" />
              </SelectTrigger>
              <SelectContent>
                {STREAMS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stream && <p className="text-xs text-destructive">{errors.stream}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label>Preferred Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className={errors.location ? "border-destructive" : ""}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>{l === "Any" ? "Any Location" : l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label>Annual Budget Range</Label>
            <Select value={budget} onValueChange={(v) => setBudget(v as BudgetRange)}>
              <SelectTrigger className={errors.budget ? "border-destructive" : ""}>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding colleges…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find My Colleges
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
