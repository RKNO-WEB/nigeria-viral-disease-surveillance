import {
  AlertLevel,
  CaseClassification,
  CaseStatus,
  ClinicalOutcome,
  Disease,
  TestResult,
  TestType,
} from "../backend";

export const DISEASE_NAMES: Record<Disease, string> = {
  [Disease.lassaFever]: "Lassa Fever",
  [Disease.ebola]: "Ebola",
  [Disease.mpox]: "Mpox",
  [Disease.cholera]: "Cholera",
  [Disease.meningitis]: "Meningitis",
  [Disease.yellowFever]: "Yellow Fever",
  [Disease.covid19]: "COVID-19",
  [Disease.marburg]: "Marburg",
};

export const WHO_CASE_DEFINITIONS: Record<Disease, string> = {
  [Disease.lassaFever]:
    "Suspected: Fever + ≥3 of: headache, sore throat, vomiting, diarrhoea, myalgia, chest pain, bleeding, or unexplained death in endemic area. Confirmed: Lab-confirmed (RT-PCR/ELISA IgM).",
  [Disease.ebola]:
    "Suspected: Fever + ≥3 of: headache, vomiting, diarrhoea, abdominal pain, unexplained bleeding, AND contact with confirmed case or dead/sick animal. Confirmed: RT-PCR positive.",
  [Disease.mpox]:
    "Suspected: Unexplained rash/vesicular lesions + ≥1 of: headache, fever, lymphadenopathy, back pain, myalgia. Confirmed: PCR positive from skin lesion.",
  [Disease.cholera]:
    "Suspected: Acute watery diarrhoea (≥3 loose stools/day) in person aged ≥5 years, or profuse watery diarrhoea causing severe dehydration. Confirmed: Culture or RDT positive.",
  [Disease.meningitis]:
    "Suspected: Sudden onset fever + stiff neck OR petechial/purpuric rash. Confirmed: Lab confirmation of causative organism from CSF/blood.",
  [Disease.yellowFever]:
    "Suspected: Acute onset fever, jaundice within 14 days of symptom onset, in area with known yellow fever risk. Confirmed: Serology (IgM/IgG) or PCR positive.",
  [Disease.covid19]:
    "Suspected: Fever + cough/shortness of breath/loss of taste or smell. Confirmed: RT-PCR or rapid antigen test positive.",
  [Disease.marburg]:
    "Suspected: Fever + ≥3 of: headache, vomiting, diarrhoea, abdominal pain, bleeding, AND contact with confirmed case. Confirmed: RT-PCR or ELISA positive.",
};

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const CLASSIFICATION_LABELS: Record<CaseClassification, string> = {
  [CaseClassification.suspected]: "Suspected",
  [CaseClassification.probable]: "Probable",
  [CaseClassification.confirmed]: "Confirmed",
};

export const OUTCOME_LABELS: Record<ClinicalOutcome, string> = {
  [ClinicalOutcome.alive]: "Alive",
  [ClinicalOutcome.dead]: "Dead",
  [ClinicalOutcome.unknown_]: "Unknown",
};

export const TEST_TYPE_LABELS: Record<TestType, string> = {
  [TestType.pcr]: "PCR",
  [TestType.rdt]: "RDT",
  [TestType.elisa]: "ELISA",
  [TestType.culture]: "Culture",
};

export const TEST_RESULT_LABELS: Record<TestResult, string> = {
  [TestResult.positive]: "Positive",
  [TestResult.negative]: "Negative",
  [TestResult.indeterminate]: "Indeterminate",
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.pending]: "Pending",
  [CaseStatus.approved]: "Approved",
  [CaseStatus.rejected]: "Rejected",
};

export const ALERT_LEVEL_LABELS: Record<AlertLevel, string> = {
  [AlertLevel.watch]: "Watch",
  [AlertLevel.warning]: "Warning",
  [AlertLevel.emergency]: "Emergency",
};
