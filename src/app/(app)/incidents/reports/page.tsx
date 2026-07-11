"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/app-bar";
import { Skeleton } from "@/components/ui";
import { EmptyState, ErrorState } from "@/components/state";
import { useMyReports } from "@/features/incident/queries";
import { incidentStatusLabel, incidentStatusVariant, incidentTypeLabel } from "@/features/incident/labels";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { CreateReportForm } from "@/features/incident/create-report-form";
import { toast } from "sonner";

const CATEGORIES = [
  { type: "water_outage", label: "Mất nước" },
  { type: "water_quality", label: "Nước đục" },
  { type: "leak", label: "Rò rỉ" },
  { type: "pipe_burst", label: "Vỡ ống" },
  { type: "maintenance", label: "Bảo trì" },
  { type: "other", label: "Khác" },
];

export default function ReportsPage() {
  return (
    <div className="pb-4">
      <AppBar title="Báo sự cố" sub="Tạo yêu cầu trong dưới 30 giây" />

      {/* Voice quick note */}
      <div className="px-4 pt-4">
        <button type="button" onClick={() => toast("Ghi âm mô tả — AI tự phân loại (demo)")} className="flex w-full items-center gap-3.5 rounded-[18px] bg-gradient-to-br from-deep to-aqua p-4 text-left text-white active:scale-[0.99]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">🎤</span>
          <span className="flex-1"><b className="text-[15px]">Báo nhanh bằng giọng nói</b><p className="text-[12.5px] opacity-90">Chụp ảnh + nói 1 câu — AI tự phân loại.</p></span>
        </button>
      </div>

      {/* Category grid */}
      <div className="px-4 pt-5">
        <h2 className="mb-2 px-1 text-sm font-bold">Chọn loại sự cố</h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <button key={c.type} type="button" onClick={() => { toast(`Đã chọn: ${c.label}`); document.getElementById("report-create")?.scrollIntoView({ behavior: "smooth" }); }} className="rounded-2xl border border-line bg-card p-3.5 text-center shadow-[0_6px_22px_rgba(10,42,56,.10)] active:translate-y-px">
              <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-aqua-soft text-deep">💧</span>
              <span className="text-xs font-semibold leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* My reports */}
      <MyReports />

      {/* Create form */}
      <div id="report-create" className="scroll-mt-20 px-4 pt-5">
        <h2 className="mb-2 px-1 text-sm font-bold">Tạo phản ánh sự cố</h2>
        <CreateReportForm />
      </div>
    </div>
  );
}

function MyReports() {
  const { data, isLoading, isError, refetch } = useMyReports();
  return (
    <div className="px-4 pt-5">
      <h2 className="mb-2 px-1 text-sm font-bold">Yêu cầu của tôi</h2>
      <div className="overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_6px_22px_rgba(10,42,56,.10)]">
        {isLoading ? <Skeleton className="h-16 w-full" />
        : isError ? <ErrorState onRetry={() => refetch()} />
        : !data?.reports.length ? <EmptyState title="Chưa có yêu cầu nào" />
        : data.reports.map((r, i) => (
            <a key={r.reportId} href={`/incidents/reports/${r.reportId}`} className={cn("flex items-center gap-3 px-4 py-3.5", i < data.reports.length - 1 ? "border-b border-line" : "")}>
              <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-amber-soft text-[#8a5410]">⚠️</span>
              <div className="min-w-0 flex-1">
                <b className="text-[14.5px] font-bold">{incidentTypeLabel[r.type] ?? r.type}</b>
                <p className="text-[12.5px] text-muted-foreground">#{r.reportId} · {formatDate(r.createdAt)}</p>
              </div>
              <Badge variant={incidentStatusVariant[r.status] ?? "secondary"}>{incidentStatusLabel[r.status] ?? r.status}</Badge>
            </a>
          ))}
      </div>
    </div>
  );
}
