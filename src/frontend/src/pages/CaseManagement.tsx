import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ClipboardList, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus, Disease } from "../backend";
import {
  useApproveReport,
  useCaseReports,
  useRejectReport,
} from "../hooks/useQueries";
import {
  CLASSIFICATION_LABELS,
  DISEASE_NAMES,
  NIGERIAN_STATES,
  OUTCOME_LABELS,
  STATUS_LABELS,
} from "../lib/constants";

const STATUS_CLASSES: Record<CaseStatus, string> = {
  [CaseStatus.pending]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [CaseStatus.approved]: "bg-green-100 text-green-800 border-green-200",
  [CaseStatus.rejected]: "bg-red-100 text-red-800 border-red-200",
};

export default function CaseManagement() {
  const [filterDisease, setFilterDisease] = useState<Disease | "all">("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "all">("all");

  const { data: reports, isLoading } = useCaseReports(
    filterDisease === "all" ? null : filterDisease,
    filterState === "all" ? null : filterState,
  );

  const { mutateAsync: approve, isPending: approving } = useApproveReport();
  const { mutateAsync: reject, isPending: rejecting } = useRejectReport();
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered =
    reports?.filter((r) =>
      filterStatus === "all" ? true : r.status === filterStatus,
    ) ?? [];

  const handleApprove = async (id: bigint) => {
    setActionId(id.toString());
    try {
      await approve(id);
      toast.success(`Case #${id} approved`);
    } catch {
      toast.error("Failed to approve case");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: bigint) => {
    setActionId(id.toString());
    try {
      await reject(id);
      toast.success(`Case #${id} rejected`);
    } catch {
      toast.error("Failed to reject case");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Case Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review, approve, or reject submitted case reports
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={filterDisease}
          onValueChange={(v) => setFilterDisease(v as Disease | "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All diseases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All diseases</SelectItem>
            {Object.values(Disease).map((d) => (
              <SelectItem key={d} value={d}>
                {DISEASE_NAMES[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all">All states</SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as CaseStatus | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(CaseStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center text-sm text-muted-foreground">
          {filtered.length} case{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">All Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" data-ocid="case_mgmt.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="case_mgmt.empty_state"
              className="py-16 flex flex-col items-center gap-3"
            >
              <ClipboardList className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No cases match the selected filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[860px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {[
                      "ID",
                      "Disease",
                      "Classification",
                      "State / LGA",
                      "Age/Sex",
                      "Outcome",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report, idx) => {
                    const isActing = actionId === report.id.toString();
                    return (
                      <tr
                        key={report.id.toString()}
                        data-ocid={`case_mgmt.row.${idx + 1}`}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                          #{report.id.toString()}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {DISEASE_NAMES[report.disease] ?? report.disease}
                        </td>
                        <td className="px-4 py-3">
                          {CLASSIFICATION_LABELS[report.classification]}
                        </td>
                        <td className="px-4 py-3">
                          <div>{report.demographics.state}</div>
                          <div className="text-xs text-muted-foreground">
                            {report.demographics.lga}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {report.demographics.age.toString()}y /{" "}
                          {report.demographics.sex}
                        </td>
                        <td className="px-4 py-3">
                          {OUTCOME_LABELS[report.outcome]}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CLASSES[report.status] ?? ""}`}
                          >
                            {STATUS_LABELS[report.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {report.status === CaseStatus.pending && (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(report.id)}
                                disabled={isActing || approving || rejecting}
                                data-ocid={`case_mgmt.approve_button.${idx + 1}`}
                              >
                                {isActing && approving ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(report.id)}
                                disabled={isActing || approving || rejecting}
                                data-ocid={`case_mgmt.reject_button.${idx + 1}`}
                              >
                                {isActing && rejecting ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
