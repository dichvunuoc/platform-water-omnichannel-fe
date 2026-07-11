export const incidentTypeLabel: Record<string, string> = {
  pipe_burst: "Vỡ ống",
  water_outage: "Mất nước",
  water_quality: "Chất lượng nước",
  leak: "Rò rỉ",
  maintenance: "Bảo trì",
  other: "Khác",
};

export const incidentStatusLabel: Record<string, string> = {
  reported: "Đã ghi nhận",
  triaged: "Đang phân tích",
  assigned: "Đã phân công",
  in_progress: "Đang xử lý",
  resolved: "Đã khắc phục",
  closed: "Đã đóng",
};

export const incidentStatusVariant: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  reported: "secondary",
  triaged: "secondary",
  assigned: "warning",
  in_progress: "warning",
  resolved: "success",
  closed: "default",
};
