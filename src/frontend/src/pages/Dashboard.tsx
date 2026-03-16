import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertLevel, ClinicalOutcome, Disease } from "../backend";
import { useAnalyticsSummary, useOutbreakAlerts } from "../hooks/useQueries";
import { ALERT_LEVEL_LABELS, DISEASE_NAMES } from "../lib/constants";

const ALERT_COLORS: Record<AlertLevel, string> = {
  [AlertLevel.watch]: "bg-blue-100 text-blue-800 border-blue-200",
  [AlertLevel.warning]: "bg-orange-100 text-orange-800 border-orange-200",
  [AlertLevel.emergency]: "bg-red-100 text-red-800 border-red-200",
};

const CHART_COLORS = [
  "#2d7a4f",
  "#c7782a",
  "#c23b2b",
  "#2b5dc2",
  "#7b2bc2",
  "#c22b7b",
  "#2bc2b5",
  "#8bc22b",
];

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } =
    useAnalyticsSummary();
  const { data: alerts, isLoading: alertsLoading } = useOutbreakAlerts();

  const stats = useMemo(() => {
    if (!analytics) return { total: 0, deaths: 0, activeAlerts: 0 };
    const total = analytics.casesByDisease.reduce(
      (s, [, c]) => s + Number(c),
      0,
    );
    const deaths =
      analytics.casesByOutcome.find(([o]) => o === ClinicalOutcome.dead)?.[1] ??
      0n;
    return { total, deaths: Number(deaths), activeAlerts: alerts?.length ?? 0 };
  }, [analytics, alerts]);

  const weeklyData = useMemo(() => {
    if (!analytics?.weeklyCounts) return [];
    return analytics.weeklyCounts.map(([week, count]) => ({
      week,
      cases: Number(count),
    }));
  }, [analytics]);

  const diseaseData = useMemo(() => {
    if (!analytics?.casesByDisease) return [];
    return analytics.casesByDisease.map(([disease, count]) => ({
      name: DISEASE_NAMES[disease as Disease] ?? disease,
      cases: Number(count),
      key: disease,
    }));
  }, [analytics]);

  const sexData = useMemo(() => {
    if (!analytics?.casesBySex) return [];
    return analytics.casesBySex.map(([sex, count]) => ({
      name: sex,
      value: Number(count),
    }));
  }, [analytics]);

  const stateData = useMemo(() => {
    if (!analytics?.casesByState) return [];
    return [...analytics.casesByState]
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 10)
      .map(([state, count]) => ({ state, cases: Number(count) }));
  }, [analytics]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Surveillance Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nigeria Viral Disease Surveillance System — real-time epidemiological
          overview
        </p>
      </div>

      {/* Alerts panel */}
      <div data-ocid="dashboard.alerts_panel">
        {alertsLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={`alert-${alert.state}-${alert.disease}-${i}`}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm font-medium ${ALERT_COLORS[alert.alertLevel]}`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>
                      {ALERT_LEVEL_LABELS[alert.alertLevel].toUpperCase()}
                    </strong>
                    : {DISEASE_NAMES[alert.disease as Disease] ?? alert.disease}{" "}
                    outbreak in <strong>{alert.state}</strong> —{" "}
                    {alert.caseCount.toString()} cases
                  </span>
                </div>
                <Badge variant="outline" className="text-xs border-current">
                  {ALERT_LEVEL_LABELS[alert.alertLevel]}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground border">
            <CheckCircle className="w-4 h-4 text-success" />
            No active outbreak alerts at this time.
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cases",
            value: stats.total,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Active Alerts",
            value: stats.activeAlerts,
            icon: AlertTriangle,
            color: "text-destructive",
          },
          {
            label: "Deaths Reported",
            value: stats.deaths,
            icon: TrendingUp,
            color: "text-destructive",
          },
          {
            label: "Diseases Tracked",
            value: Object.keys(Disease).length,
            icon: Activity,
            color: "text-primary",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {label}
                  </p>
                  {analyticsLoading ? (
                    <Skeleton className="h-7 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-display font-bold text-foreground mt-0.5">
                      {value.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className={`p-2.5 rounded-lg bg-muted ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              Weekly Case Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : weeklyData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={200}
                data-ocid="dashboard.weekly_chart"
              >
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.022 155)"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#2d7a4f"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2d7a4f" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              Cases by Disease
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : diseaseData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={200}
                data-ocid="dashboard.disease_chart"
              >
                <BarChart data={diseaseData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.022 155)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Bar dataKey="cases" radius={[0, 4, 4, 0]}>
                    {diseaseData.map((entry, idx) => (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* State table + Sex pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 shadow-card"
          data-ocid="dashboard.state_table"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              Top States by Case Load
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analyticsLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : stateData.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No state data available
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      State
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Cases
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stateData.map(({ state, cases }, idx) => (
                    <tr
                      key={state}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{state}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">
                        {cases.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              Sex Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : sexData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={sexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sexData.map((entry) => (
                      <Cell
                        key={`sex-${entry.name}`}
                        fill={
                          CHART_COLORS[
                            sexData.indexOf(entry) % CHART_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
