import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FlaskConical } from "lucide-react";
import { useState } from "react";
import { CaseStatus } from "../backend";
import LabResultModal from "../components/LabResultModal";
import { useCaseReports } from "../hooks/useQueries";
import {
  CLASSIFICATION_LABELS,
  DISEASE_NAMES,
  OUTCOME_LABELS,
  STATUS_LABELS,
} from "../lib/constants";

const STATUS_VARIANTS: Record<CaseStatus, { className: string }> = {
  [CaseStatus.pending]: {
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [CaseStatus.approved]: {
    className: "bg-green-100 text-green-800 border-green-200",
  },
  [CaseStatus.rejected]: {
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export default function MyReports() {
  const { data: reports, isLoading } = useCaseReports();
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<bigint | null>(null);

  const openLabModal = (id: bigint) => {
    setSelectedReportId(id);
    setLabModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">My Case Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track the status of reports you have submitted
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">
            Submitted Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full"
                  data-ocid="my_reports.loading_state"
                />
              ))}
            </div>
          ) : !reports || reports.length === 0 ? (
            <div
              data-ocid="my_reports.empty_state"
              className="py-16 flex flex-col items-center gap-3 text-center"
            >
              <FileText className="w-10 h-10 text-muted-foreground/40" />
              <div>
                <p className="font-medium text-foreground">No reports yet</p>
                <p className="text-sm text-muted-foreground">
                  Submit your first case report using the Report Case page.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Disease
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Classification
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      State
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Outcome
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Lab
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr
                      key={report.id.toString()}
                      data-ocid={`my_reports.item.${idx + 1}`}
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
                      <td className="px-4 py-3">{report.demographics.state}</td>
                      <td className="px-4 py-3">
                        {OUTCOME_LABELS[report.outcome]}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            STATUS_VARIANTS[report.status]?.className ?? ""
                          }`}
                        >
                          {STATUS_LABELS[report.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {report.labResult ? (
                          <Badge
                            variant="outline"
                            className="text-xs border-primary/30 text-primary"
                          >
                            <FlaskConical className="w-3 h-3 mr-1" /> Attached
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => openLabModal(report.id)}
                            data-ocid={`my_reports.item.${idx + 1}`}
                          >
                            <FlaskConical className="w-3 h-3 mr-1" /> Add Lab
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedReportId !== null && (
        <LabResultModal
          open={labModalOpen}
          onOpenChange={setLabModalOpen}
          reportId={selectedReportId}
        />
      )}
    </div>
  );
}
