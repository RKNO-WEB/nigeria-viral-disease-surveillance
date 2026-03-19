import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface ReviewerApplication {
    institution: string;
    name: string;
    qualifications: string;
    email: string;
    expertise: Array<string>;
}
export interface JournalArticle {
    id: bigint;
    pdf: ExternalBlob;
    status: ArticleStatus;
    title: string;
    featured: boolean;
    authors: Array<string>;
    publicationDate?: Time;
    journalName: string;
    abstract: string;
    category: string;
}
export interface ManuscriptSubmission {
    id: bigint;
    status: ArticleStatus;
    title: string;
    authors: Array<string>;
    contactEmail: string;
    abstract: string;
    category: string;
    manuscriptFile: ExternalBlob;
}
export interface UserProfile {
    name: string;
    role: string;
    organization: string;
}
export enum ArticleStatus {
    underReview = "underReview",
    published = "published",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getArticleById(id: bigint): Promise<JournalArticle | null>;
    getArticles(): Promise<Array<JournalArticle>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedArticles(): Promise<Array<JournalArticle>>;
    getLatestArticles(limit: bigint): Promise<Array<JournalArticle>>;
    getPaperStatus(paperId: bigint): Promise<ArticleStatus | null>;
    getReviewerApplications(): Promise<Array<ReviewerApplication>>;
    getSubmissions(): Promise<Array<ManuscriptSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishArticle(submissionId: bigint, journalName: string, publicationDate: Time, featured: boolean): Promise<bigint>;
    registerReviewer(name: string, email: string, institution: string, qualifications: string, expertise: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFeatured(articleId: bigint, featured: boolean): Promise<void>;
    submitManuscript(title: string, abstract: string, authors: Array<string>, category: string, contactEmail: string, pdf: ExternalBlob): Promise<bigint>;
    updatePaperStatus(paperId: bigint, status: ArticleStatus): Promise<void>;
}
