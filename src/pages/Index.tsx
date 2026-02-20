import { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { StudentForm } from "@/components/StudentForm";
import { CollegeCard } from "@/components/CollegeCard";
import { AIExplanationBox } from "@/components/AIExplanationBox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  filterColleges,
  sortColleges,
  applyClientFilters,
  type StudentProfile,
  type SortOption,
} from "@/data/colleges";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowDown } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Index() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<ReturnType<typeof filterColleges>>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [hasSearched, setHasSearched] = useState(false);

  // Client-side filter states
  const [filterName, setFilterName] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<"any" | "private" | "govt">("any");

  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAIExplanation = useCallback(
    async (p: StudentProfile, matched: ReturnType<typeof filterColleges>) => {
      setAiText("");
      setAiError(null);
      setAiLoading(true);

      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/college-recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            percentile: p.percentile,
            stream: p.stream,
            location: p.location,
            budget: p.budget,
            matchedColleges: matched.map((c) => c.name),
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({ error: "Unknown error" }));
          if (resp.status === 429) {
            toast({ title: "Rate limit exceeded", description: data.error, variant: "destructive" });
          } else if (resp.status === 402) {
            toast({ title: "Credits exhausted", description: data.error, variant: "destructive" });
          }
          setAiError(data.error ?? "Failed to generate explanation.");
          setAiLoading(false);
          return;
        }

        if (!resp.body) {
          setAiError("No response from AI.");
          setAiLoading(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamDone = false;

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") { streamDone = true; break; }
            try {
              const parsed = JSON.parse(jsonStr);
              const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (chunk) setAiText((prev) => prev + chunk);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI error. Please retry.";
        setAiError(msg);
        toast({ title: "AI Error", description: msg, variant: "destructive" });
      } finally {
        setAiLoading(false);
      }
    },
    [toast]
  );

  const handleSubmit = async (p: StudentProfile) => {
    setIsSubmitting(true);
    setProfile(p);
    const matched = filterColleges(p);
    setResults(matched);
    setHasSearched(true);
    setIsSubmitting(false);

    // Scroll to results smoothly
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    await fetchAIExplanation(p, matched);
  };

  // Apply client filters first, then sort
  const filteredResults = useMemo(() => {
    return applyClientFilters(results, { name: filterName, minRating, type: typeFilter });
  }, [results, filterName, minRating, typeFilter]);

  const sorted = sortColleges(filteredResults, sortBy);

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Form section */}
        <div className="max-w-xl mx-auto">
          <StudentForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>

        {/* Results section */}
        {hasSearched && (
          <div id="results" className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Separator className="mb-8" />

            {/* AI Explanation */}
            <div className="mb-6">
              <AIExplanationBox
                text={aiText}
                isLoading={aiLoading}
                error={aiError}
                onRetry={() => profile && fetchAIExplanation(profile, results)}
              />
            </div>

            {/* Client-side filters (name, rating, type) */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex gap-2 w-full">
                  <Input
                    placeholder="Search college name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full sm:w-64"
                  />

                  <Select value={String(minRating)} onValueChange={(v) => setMinRating(parseFloat(v))}>
                    <SelectTrigger className="w-36 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3★+</SelectItem>
                      <SelectItem value="4">4★+</SelectItem>
                      <SelectItem value="4.5">4.5★+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "any" | "private" | "govt")}>
                    <SelectTrigger className="w-36 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="govt">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => { setFilterName(""); setMinRating(0); setTypeFilter("any"); }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Results header + sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="font-semibold text-foreground text-base">
                  {results.length > 0
                    ? `${results.length} college${results.length === 1 ? "" : "s"} matched`
                    : "No colleges matched"}
                </h2>
                {profile && (
                  <p className="text-sm text-muted-foreground">
                    {profile.percentile}th percentile · {profile.stream} · {profile.location === "Any" ? "Any Location" : profile.location}
                  </p>
                )}
              </div>

              {results.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-44 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating (Best first)</SelectItem>
                      <SelectItem value="fees-asc">Fees: Low to High</SelectItem>
                      <SelectItem value="fees-desc">Fees: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* College list or empty state */}
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-16 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No colleges matched your criteria</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try lowering your percentile requirement, selecting "Any Location", or increasing your budget range.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ArrowDown className="mr-2 h-3.5 w-3.5 rotate-180" />
                  Adjust Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    studentPercentile={profile!.percentile}
                    stream={profile!.stream}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
