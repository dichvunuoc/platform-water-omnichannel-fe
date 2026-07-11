"use client";

import { use } from "react";
import { AppBar } from "@/components/layout/app-bar";
import { Skeleton, Badge } from "@/components/ui";
import { EmptyState, ErrorState } from "@/components/state";
import { useReportDetail } from "@/features/incident/queries";
import { incidentStatusLabel, incidentStatusVariant, incidentTypeLabel } from "@/features/incident/labels";
import { cn, formatDate } from "@/lib/utils";

export default function ReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const { data: report, isLoading, isError, refetch } = useReportDetail(reportId);

  return (
    <div className="pb-4">
      <AppBar title="Theo dõi yêu cầu" sub={`#${reportId}`} back />

      <div className="space-y-4 p-4">
        {isLoading ? <Skeleton className="h-64 w-full" />
        : isError ? <ErrorState onRetry={() => refetch()} />
        : !report ? <EmptyState />
        : (
          <>
            {/* Status */}
            <Badge variant={incidentStatusVariant[report.status] ?? "secondary"}>
              {incidentStatusLabel[report.status] ?? report.status}
            </Badge>

            {/* Report info */}
            <div className="rounded-[18px] border border-line bg-card p-4 shadow-[0_6px_22px_rgba(10,42,56,.10)]">
              <div className="mb-2 flex items-center justify-between">
                <b className="text-[15px]">{incidentTypeLabel[report.type] ?? report.type}</b>
                <span className="text-[12px] text-muted-foreground">#{report.reportId}</span>
              </div>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">{report.description}</p>
              <div className="mt-3 space-y-1 text-[12.5px] text-muted-foreground">
                <p>📍 {report.location.address}</p>
                <p>🕐 Gửi: {formatDate(report.createdAt)} · Cập nhật: {formatDate(report.updatedAt)}</p>
              </div>
            </div>

            {/* Linked incident */}
            {report.incidentSummary ? (
              <div className="rounded-[18px] border border-[#CBE9DC] bg-mint-soft p-4">
                <b className="text-[14px] text-[#0f6b4c]">🔄 Sự cố liên kết</b>
                <div className="mt-2 space-y-1 text-[12.5px] text-muted-foreground">
                  <p>Mã sự cố: <b>#{report.incidentSummary.incidentId}</b></p>
                  <p>Loại: {incidentTypeLabel[report.incidentSummary.type] ?? report.incidentSummary.type}</p>
                  <p>Trạng thái: {incidentStatusLabel[report.incidentSummary.status] ?? report.incidentSummary.status}</p>
                  <p>Mức độ: <b className="capitalize">{report.incidentSummary.severity}</b></p>
                  <p>{report.incidentSummary.affectedCustomers} khách hàng bị ảnh hưởng</p>
                  {report.incidentSummary.assignedTeam ? <p>Đội xử lý: {report.incidentSummary.assignedTeam}</p> : null}
                </div>
                <p className="mt-2 text-[11.5px] italic text-muted-foreground">
                  Đây là sự cố chung do GIS Triage gộp từ nhiều báo cáo cùng khu vực.
                </p>
              </div>
            ) : (
              <div className="rounded-[18px] border border-line bg-foam p-4 text-center">
                <p className="text-[13px] text-muted-foreground">
                  Hệ thống đang kiểm tra và gộp với các báo cáo cùng khu vực...
                </p>
              </div>
            )}

            {/* Photos */}
            {report.photoUrls.length > 0 ? (
              <div>
                <h2 className="mb-2 px-1 text-sm font-bold">Ảnh hiện trạng</h2>
                <div className="flex flex-wrap gap-2.5">
                  {report.photoUrls.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Ảnh ${i + 1}`} className="h-20 w-20 rounded-[13px] border border-line object-cover" />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
