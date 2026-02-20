import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AIExplanationBoxProps {
  text: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function AIExplanationBox({ text, isLoading, error, onRetry }: AIExplanationBoxProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-foreground">AI Explanation</p>
              {error && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  className="h-7 gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
              )}
            </div>

            {isLoading && !text && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            )}

            {error && !isLoading && (
              <div className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {text && (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {text}
                {isLoading && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-text-bottom" />
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
