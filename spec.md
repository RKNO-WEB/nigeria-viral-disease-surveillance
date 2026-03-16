# Nigeria Viral Disease Surveillance System (NVDSS)

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Case Reporting Interface**: Form-based interface for health workers to submit disease case reports using WHO-standardized case definitions. Covers priority diseases: Lassa Fever, Ebola, Mpox, Cholera, Meningitis, Yellow Fever, COVID-19.
- **User Roles**: Three roles via authorization component — `admin` (NCDC/national), `supervisor` (state/LGA level), `reporter` (health facility worker).
- **Case Report Data Model**: Each report captures patient demographics (age, sex, LGA, state), disease type, case classification (suspected/probable/confirmed), symptom onset date, exposure history, outcome, and lab result linkage.
- **Lab Data Entry**: Lab technicians (reporter role) can attach lab results (test type, result, date) to existing case reports.
- **Analytics Dashboard**: Visualizations for:
  - Cases over time (line/bar chart by week/month)
  - Geographic distribution (cases by state and LGA — table/heatmap)
  - Case breakdown by person (age group, sex)
  - Lab confirmation rate
  - Disease-specific filtering
- **Alert System**: Threshold-based outbreak flags — if case count for a disease in a location exceeds a threshold within 7 days, mark it as a cluster alert.
- **Admin Controls**: Admins can manage users, view all reports, and approve/reject submitted reports.

### Modify
- None (new project).

### Remove
- None (new project).

## Implementation Plan

### Backend (Motoko)
1. Data types: `CaseReport`, `LabResult`, `OutbreakAlert`, `DiseaseType` variant, `CaseClassification` variant, `ReportStatus` variant.
2. Storage: stable `HashMap` for case reports keyed by report ID; stable array for alerts.
3. APIs:
   - `submitCaseReport(report)` — reporter/supervisor only
   - `updateCaseReport(id, update)` — reporter (own), supervisor/admin
   - `attachLabResult(reportId, labResult)` — reporter/supervisor
   - `getCaseReports(filter)` — returns filtered list (by disease, state, date range)
   - `getCaseById(id)` — get single report
   - `getAnalyticsSummary()` — aggregated stats for dashboard
   - `getOutbreakAlerts()` — active alerts
   - `approveReport(id)` / `rejectReport(id)` — admin only
   - `getReportsByUser()` — reporter sees own submissions
4. Outbreak detection: after each submission, check 7-day rolling count per disease+state; auto-create alert if threshold (5 cases) exceeded.

### Frontend (React + TypeScript)
1. Auth gate with role-aware navigation.
2. **Reporting Page**: Multi-step form — patient info → disease details → symptoms → exposure → lab (optional). Uses WHO case definitions as inline guidance text.
3. **My Reports Page**: Reporter views/edits own submitted cases.
4. **Case Management Page** (supervisor/admin): Table of all reports with status filters, approve/reject actions.
5. **Analytics Dashboard**: Charts for time trends, geographic table, demographic breakdown, lab stats. Disease filter + date range selector.
6. **Alerts Panel**: Live outbreak cluster alerts with severity badge.
7. **Lab Entry Modal**: Attach lab result to an existing report.
