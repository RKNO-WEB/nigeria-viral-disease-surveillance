import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CaseClassification,
  ClinicalOutcome,
  Disease,
  LabResult,
  PatientDemographics,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalyticsSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalyticsSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOutbreakAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOutbreakAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCaseReports(
  filterDisease: Disease | null = null,
  filterState: string | null = null,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["caseReports", filterDisease, filterState],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCaseReports(filterDisease, filterState);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitCaseReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      demographics: PatientDemographics;
      disease: Disease;
      classification: CaseClassification;
      symptomsDate: string;
      exposureHistory: string;
      outcome: ClinicalOutcome;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitCaseReport(
        params.demographics,
        params.disease,
        params.classification,
        params.symptomsDate,
        params.exposureHistory,
        params.outcome,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseReports"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useAttachLabResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { reportId: bigint; labResult: LabResult }) => {
      if (!actor) throw new Error("Not connected");
      return actor.attachLabResult(params.reportId, params.labResult);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseReports"] });
    },
  });
}

export function useApproveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseReports"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useRejectReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseReports"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
