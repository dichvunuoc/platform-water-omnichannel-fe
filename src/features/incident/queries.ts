"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/types/api";

// ── Types (inline — match BE incident.dto.ts) ─────────────────────────────────
export interface IncidentReport {
  reportId: string;
  customerId: string;
  type: string;
  description: string;
  photoUrls: string[];
  location: { lat: number; lng: number; address: string; area: string | null };
  status: string;
  incidentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDetail extends IncidentReport {
  incidentSummary: {
    incidentId: string;
    type: string;
    status: string;
    severity: string;
    affectedCustomers: number;
    assignedTeam: string | null;
  } | null;
}

export interface CreateReportResult {
  reportId: string;
  status: string;
  incidentId: string | null;
  message: string;
}

// ── Query keys ────────────────────────────────────────────────────────────────
export const reportKeys = {
  all: ["incident-reports"] as const,
  my: (status?: string) => ["incident-reports", "my", status] as const,
  detail: (id: string) => ["incident-reports", id] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useMyReports(status?: string) {
  return useQuery({
    queryKey: reportKeys.my(status),
    queryFn: () =>
      apiClient.get<{ reports: IncidentReport[]; totalCount: number }>(
        "/incidents/reports",
        status ? { status } : undefined,
      ),
  });
}

export function useReportDetail(reportId: string) {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => apiClient.get<ReportDetail>(`/incidents/reports/${reportId}`),
    enabled: Boolean(reportId),
  });
}

export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      type: string;
      description: string;
      photoUrls?: string[];
      location: { lat: number; lng: number; address: string; area: string | null };
    }) => apiClient.post<CreateReportResult>("/incidents/reports", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: reportKeys.all }),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

/** Upload photo via document port (replaces old ticket upload). */
export function useUploadReportPhoto() {
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const { uploadUrl, fileKey } = await apiClient.post<{ uploadUrl: string; fileKey: string }>(
        "/documents/upload-url",
        { fileName: file.name, fileType: file.type as "image/jpeg" | "image/png" | "image/webp" },
      );
      try {
        const putRes = await fetch(uploadUrl, { method: "PUT", body: file });
        if (!putRes.ok) throw new Error("Tải ảnh lên thất bại");
        return { fileKey, publicUrl: uploadUrl.split("?")[0] };
      } catch {
        return { fileKey, publicUrl: URL.createObjectURL(file) };
      }
    },
    onError: (e) => toast.error((e as Error).message ?? "Tải ảnh lên thất bại"),
  });
}
