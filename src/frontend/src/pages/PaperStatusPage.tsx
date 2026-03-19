import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSearch, Loader2 } from "lucide-react";
import { useState } from "react";
import { ArticleStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { ARTICLE_STATUS_COLORS, ARTICLE_STATUS_LABELS } from "../lib/constants";

export default function PaperStatusPage() {
  const { actor } = useActor();
  const [paperIdInput, setPaperIdInput] = useState("");
  const [status, setStatus] = useState<ArticleStatus | null | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    const id = Number.parseInt(paperIdInput, 10);
    if (Number.isNaN(id) || id < 0) {
      setError("Please enter a valid Paper ID number.");
      return;
    }
    if (!actor) {
      setError("Not connected to backend.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await actor.getPaperStatus(BigInt(id));
      setStatus(result);
    } catch {
      setError("Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#E9EFF4] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FileSearch className="w-8 h-8 text-[#0B2C45]" />
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">
          Check Paper Status
        </h1>
        <p className="text-[#6B7280]">
          Enter your Paper ID to view the current review status of your
          submission.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <div className="space-y-4">
          <div>
            <Label className="mb-2">Paper ID</Label>
            <Input
              type="number"
              min={0}
              value={paperIdInput}
              onChange={(e) => {
                setPaperIdInput(e.target.value);
                setStatus(undefined);
                setError("");
              }}
              placeholder="e.g. 1001"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            onClick={handleCheck}
            disabled={loading || !paperIdInput}
            className="w-full bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...
              </>
            ) : (
              "Check Status"
            )}
          </Button>
        </div>

        {status !== undefined && (
          <div className="mt-8 p-6 bg-[#F2F4F7] rounded-xl text-center">
            {status === null ? (
              <>
                <p className="text-[#111827] font-semibold mb-1">
                  Paper Not Found
                </p>
                <p className="text-[#6B7280] text-sm">
                  No submission found with Paper ID #{paperIdInput}
                </p>
              </>
            ) : (
              <>
                <p className="text-[#6B7280] text-sm mb-3">
                  Paper ID #{paperIdInput}
                </p>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    ARTICLE_STATUS_COLORS[status as ArticleStatus]
                  }`}
                >
                  {ARTICLE_STATUS_LABELS[status as ArticleStatus]}
                </span>
                <p className="text-[#6B7280] text-xs mt-4">
                  {status === ArticleStatus.underReview &&
                    "Your manuscript is currently under peer review. This process typically takes 4–6 weeks."}
                  {status === ArticleStatus.published &&
                    "Congratulations! Your manuscript has been accepted and published."}
                  {status === ArticleStatus.rejected &&
                    "Unfortunately, your manuscript did not meet our publication criteria. You may revise and resubmit."}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
