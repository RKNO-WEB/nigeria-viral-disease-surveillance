import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseClassification, ClinicalOutcome, Disease } from "../backend";
import { useSubmitCaseReport } from "../hooks/useQueries";
import {
  CLASSIFICATION_LABELS,
  DISEASE_NAMES,
  NIGERIAN_STATES,
  OUTCOME_LABELS,
  WHO_CASE_DEFINITIONS,
} from "../lib/constants";

interface FormData {
  age: string;
  sex: string;
  state: string;
  lga: string;
  disease: Disease | "";
  classification: CaseClassification | "";
  symptomsDate: string;
  exposureHistory: string;
  outcome: ClinicalOutcome | "";
}

const INITIAL_FORM: FormData = {
  age: "",
  sex: "",
  state: "",
  lga: "",
  disease: "",
  classification: "",
  symptomsDate: "",
  exposureHistory: "",
  outcome: "",
};

const STEP_LABELS = ["Patient Info", "Disease Details", "Review & Submit"];

export default function ReportCase({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitCaseReport();

  const set = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.age || Number(form.age) <= 0 || Number(form.age) > 120) {
      toast.error("Please enter a valid age (1–120)");
      return false;
    }
    if (!form.sex) {
      toast.error("Please select sex");
      return false;
    }
    if (!form.state) {
      toast.error("Please select state");
      return false;
    }
    if (!form.lga) {
      toast.error("Please enter LGA");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.disease) {
      toast.error("Please select a disease");
      return false;
    }
    if (!form.classification) {
      toast.error("Please select classification");
      return false;
    }
    if (!form.symptomsDate) {
      toast.error("Please enter symptom onset date");
      return false;
    }
    if (!form.outcome) {
      toast.error("Please select clinical outcome");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        demographics: {
          age: BigInt(form.age),
          sex: form.sex,
          state: form.state,
          lga: form.lga,
        },
        disease: form.disease as Disease,
        classification: form.classification as CaseClassification,
        symptomsDate: form.symptomsDate,
        exposureHistory: form.exposureHistory,
        outcome: form.outcome as ClinicalOutcome,
      });
      setSubmitted(true);
      toast.success("Case report submitted successfully");
    } catch {
      toast.error("Failed to submit case report. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold">Report Submitted</h2>
          <p className="text-muted-foreground">
            Your case report has been submitted and is pending review. Track its
            status in My Reports.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setForm(INITIAL_FORM);
                setStep(1);
                setSubmitted(false);
              }}
            >
              Report Another
            </Button>
            <Button onClick={onSuccess}>View My Reports</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Report a Disease Case
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Submit using WHO-standardized case definitions
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                step > idx + 1
                  ? "bg-primary text-primary-foreground"
                  : step === idx + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > idx + 1 ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${step === idx + 1 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {idx < 2 && (
              <div
                className={`flex-1 h-px ${step > idx + 1 ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="shadow-card">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Step 1: Patient Information
              </CardTitle>
              <CardDescription>
                Enter patient demographics (no identifying information)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="e.g. 34"
                    value={form.age}
                    onChange={(e) => set("age")(e.target.value)}
                    data-ocid="report.age_input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select value={form.sex} onValueChange={set("sex")}>
                    <SelectTrigger data-ocid="report.sex_select">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={form.state} onValueChange={set("state")}>
                  <SelectTrigger data-ocid="report.state_select">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area (LGA)</Label>
                <Input
                  id="lga"
                  placeholder="e.g. Ikorodu, Kosofe"
                  value={form.lga}
                  onChange={(e) => set("lga")(e.target.value)}
                  data-ocid="report.lga_input"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => validateStep1() && setStep(2)}
                  data-ocid="report.step1_next_button"
                >
                  Next: Disease Details →
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Step 2: Disease Details
              </CardTitle>
              <CardDescription>
                Select disease and clinical classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Disease</Label>
                <Select value={form.disease} onValueChange={set("disease")}>
                  <SelectTrigger data-ocid="report.disease_select">
                    <SelectValue placeholder="Select disease" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Disease).map((d) => (
                      <SelectItem key={d} value={d}>
                        {DISEASE_NAMES[d]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.disease && (
                  <div className="flex gap-2 p-3 bg-muted/60 rounded-md border border-border/50">
                    <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>WHO Case Definition:</strong>{" "}
                      {WHO_CASE_DEFINITIONS[form.disease as Disease]}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Case Classification</Label>
                <Select
                  value={form.classification}
                  onValueChange={set("classification")}
                >
                  <SelectTrigger data-ocid="report.classification_select">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CaseClassification).map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASSIFICATION_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="onset">Symptom Onset Date</Label>
                <Input
                  id="onset"
                  type="date"
                  value={form.symptomsDate}
                  onChange={(e) => set("symptomsDate")(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  data-ocid="report.onset_date_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exposure">Exposure History</Label>
                <Textarea
                  id="exposure"
                  placeholder="Describe any known exposures, travel history, contact with sick persons or animals..."
                  value={form.exposureHistory}
                  onChange={(e) => set("exposureHistory")(e.target.value)}
                  rows={3}
                  data-ocid="report.exposure_textarea"
                />
              </div>
              <div className="space-y-2">
                <Label>Clinical Outcome</Label>
                <Select value={form.outcome} onValueChange={set("outcome")}>
                  <SelectTrigger data-ocid="report.outcome_select">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClinicalOutcome).map((o) => (
                      <SelectItem key={o} value={o}>
                        {OUTCOME_LABELS[o]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  data-ocid="report.step2_back_button"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => validateStep2() && setStep(3)}
                  data-ocid="report.step2_next_button"
                >
                  Review Report →
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Step 3: Review & Submit
              </CardTitle>
              <CardDescription>
                Confirm all details before final submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Patient Demographics
                  </h3>
                  {[
                    { label: "Age", value: `${form.age} years` },
                    { label: "Sex", value: form.sex },
                    { label: "State", value: form.state },
                    { label: "LGA", value: form.lga },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Clinical Details
                  </h3>
                  {[
                    {
                      label: "Disease",
                      value:
                        DISEASE_NAMES[form.disease as Disease] ?? form.disease,
                    },
                    {
                      label: "Classification",
                      value:
                        CLASSIFICATION_LABELS[
                          form.classification as CaseClassification
                        ] ?? form.classification,
                    },
                    { label: "Symptom Date", value: form.symptomsDate },
                    {
                      label: "Outcome",
                      value:
                        OUTCOME_LABELS[form.outcome as ClinicalOutcome] ??
                        form.outcome,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {form.exposureHistory && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Exposure History
                  </p>
                  <p className="text-sm bg-muted/50 rounded p-3 border">
                    {form.exposureHistory}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ← Edit Details
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  data-ocid="report.submit_button"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Case Report
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
