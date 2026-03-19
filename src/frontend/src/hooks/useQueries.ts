import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ArticleStatus, ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useArticles() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor,
  });
}

export function useArticle(id: bigint) {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["article", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getArticleById(id);
    },
    enabled: !!actor,
  });
}

export function useFeaturedArticles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["featuredArticles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestArticles(limit: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["latestArticles", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestArticles(limit);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePaperStatus(paperId: bigint | null) {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["paperStatus", paperId?.toString()],
    queryFn: async () => {
      if (!actor || paperId === null) return null;
      return actor.getPaperStatus(paperId);
    },
    enabled: !!actor && paperId !== null,
  });
}

export function useUserRole() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor,
  });
}

export function useIsAdmin() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor,
  });
}

export function useUserProfile() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor,
  });
}

export function useReviewerApplications() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["reviewerApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviewerApplications();
    },
    enabled: !!actor,
  });
}

export function useSubmitManuscript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      abstract: string;
      authors: string[];
      category: string;
      contactEmail: string;
      pdf: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitManuscript(
        params.title,
        params.abstract,
        params.authors,
        params.category,
        params.contactEmail,
        params.pdf,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useRegisterReviewer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      institution: string;
      qualifications: string;
      expertise: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerReviewer(
        params.name,
        params.email,
        params.institution,
        params.qualifications,
        params.expertise,
      );
    },
  });
}

export function useUpdatePaperStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { paperId: bigint; status: ArticleStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePaperStatus(params.paperId, params.status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: {
      name: string;
      role: string;
      organization: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
