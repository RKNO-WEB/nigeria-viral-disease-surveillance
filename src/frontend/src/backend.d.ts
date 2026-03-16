import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface AnalyticsSummary {
    weeklyCounts: Array<[string, bigint]>;
    casesByDisease: Array<[Disease, bigint]>;
    casesByOutcome: Array<[ClinicalOutcome, bigint]>;
    casesByAgeGroup: Array<[string, bigint]>;
    casesBySex: Array<[string, bigint]>;
    casesByState: Array<[string, bigint]>;
}
export interface PatientDemographics {
    age: bigint;
    lga: string;
    sex: string;
    state: string;
}
export interface LabResult {
    result: TestResult;
    testType: TestType;
    collectionDate: string;
    labName: string;
}
export interface CaseReport {
    id: bigint;
    status: CaseStatus;
    exposureHistory: string;
    symptomsDate: string;
    timestamp: Time;
    disease: Disease;
    labResult?: LabResult;
    outcome: ClinicalOutcome;
    reporter: Principal;
    demographics: PatientDemographics;
    classification: CaseClassification;
}
export interface OutbreakAlert {
    caseCount: bigint;
    alertLevel: AlertLevel;
    state: string;
    disease: Disease;
    weekStart: Time;
}
export interface UserProfile {
    name: string;
    role: string;
    organization: string;
}
export enum AlertLevel {
    warning = "warning",
    emergency = "emergency",
    watch = "watch"
}
export enum CaseClassification {
    probable = "probable",
    suspected = "suspected",
    confirmed = "confirmed"
}
export enum CaseStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ClinicalOutcome {
    alive = "alive",
    dead = "dead",
    unknown_ = "unknown"
}
export enum Disease {
    yellowFever = "yellowFever",
    mpox = "mpox",
    meningitis = "meningitis",
    marburg = "marburg",
    ebola = "ebola",
    covid19 = "covid19",
    lassaFever = "lassaFever",
    cholera = "cholera"
}
export enum TestResult {
    indeterminate = "indeterminate",
    negative = "negative",
    positive = "positive"
}
export enum TestType {
    pcr = "pcr",
    rdt = "rdt",
    culture = "culture",
    elisa = "elisa"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveReport(reportId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    attachLabResult(reportId: bigint, labResult: LabResult): Promise<void>;
    getAnalyticsSummary(): Promise<AnalyticsSummary>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaseById(id: bigint): Promise<CaseReport>;
    getCaseReports(filterDisease: Disease | null, filterState: string | null): Promise<Array<CaseReport>>;
    getOutbreakAlerts(): Promise<Array<OutbreakAlert>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectReport(reportId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCaseReport(demographics: PatientDemographics, disease: Disease, classification: CaseClassification, symptomsDate: string, exposureHistory: string, outcome: ClinicalOutcome): Promise<bigint>;
    updateCaseReport(id: bigint, demographics: PatientDemographics, disease: Disease, classification: CaseClassification, symptomsDate: string, exposureHistory: string, outcome: ClinicalOutcome): Promise<void>;
}
