import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Bell, CheckCircle } from "lucide-react";
import { AlertLevel, type Disease } from "../backend";
import { useOutbreakAlerts } from "../hooks/useQueries";
import { ALERT_LEVEL_LABELS, DISEASE_NAMES } from "../lib/constants";

const ALERT_STYLES: Record<
  AlertLevel,
  { card: string; badge: string; icon: string }
> = {
  [AlertLevel.watch]: {
    card: "border-blue-200 bg-blue-50/50",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "text-blue-600",
  },
  [AlertLevel.warning]: {
    card: "border-orange-200 bg-orange-50/50",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    icon: "text-orange-600",
  },
  [AlertLevel.emergency]: {
    card: "border-red-300 bg-red-50/60",
    badge: "bg-red-100 text-red-800 border-red-300",
    icon: "text-red-600",
  },
};

function formatWeekDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

export default function Alerts() {
  const { data: alerts, isLoading } = useOutbreakAlerts();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Outbreak Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Active public health alerts generated from 7-day rolling case counts
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-40"
              data-ocid="alerts.loading_state"
            />
          ))}
        </div>
      ) : !alerts || alerts.length === 0 ? (
        <div
          data-ocid="alerts.empty_state"
          className="py-20 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-lg">
              No Active Alerts
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
              No outbreak thresholds have been exceeded this week. Continue
              routine surveillance.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert, idx) => {
            const styles = ALERT_STYLES[alert.alertLevel];
            const cardKey = `${alert.state}-${alert.disease}-${alert.weekStart.toString()}`;
            return (
              <Card
                key={cardKey}
                data-ocid={`alerts.item.${idx + 1}`}
                className={`border-2 shadow-card transition-transform hover:-translate-y-0.5 ${styles.card}`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-5 h-5 flex-shrink-0 ${styles.icon}`}
                      />
                      <span className="font-display font-bold text-base leading-tight">
                        {DISEASE_NAMES[alert.disease as Disease] ??
                          alert.disease}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 ${styles.badge}`}
                    >
                      {ALERT_LEVEL_LABELS[alert.alertLevel].toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">State</span>
                      <span className="font-semibold">{alert.state}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Case Count (7-day)
                      </span>
                      <span className="font-bold text-lg">
                        {alert.caseCount.toString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Week of</span>
                      <span className="font-medium">
                        {formatWeekDate(alert.weekStart)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 pt-1 text-xs font-medium ${styles.icon}`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Alert issued by NCDC surveillance system
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
