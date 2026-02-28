import OpenAI from "openai";
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

const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

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
      const client = getOpenAIClient();
      if (!client) {
        setAiError("OpenAI API key is missing. Please check your environment variables. Get your OpenAI API key here: https://platform.openai.com");
        setAiLoading(false);
        return;
      }

      setAiText("");
      setAiError(null);
      setAiLoading(true);

      try {
        const stream = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful college counselor. Explain why the following colleges are good matches for the student's academic profile (percentile), stream preference, and budget. Be concise and encouraging."
            },
            {
              role: "user",
              content: `Student Profile:
- Percentile: ${p.percentile}
- Stream: ${p.stream}
- Budget Range: ${p.budget}
- Location: ${p.location}

Matched Colleges: ${matched.map((c) => c.name).join(", ")}`
            }
          ],
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            setAiText((prev) => prev + content);
          }
        }
      } catch (e: any) {
        console.error("OpenAI Error:", e);
        const errorMessage = e?.message || "AI error. Please retry.";
        setAiError(errorMessage);
        toast({
          title: "AI Error",
          description: errorMessage,
          variant: "destructive"
        });
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

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
