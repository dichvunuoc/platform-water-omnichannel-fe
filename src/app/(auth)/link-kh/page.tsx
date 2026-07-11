"use client";

import { useEffect, useState } from "react";
import { QrCode, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function LinkKhPage() {
  const { data: session, isPending } = useSession();
  const [maKh, setMaKh] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      window.location.replace("/login");
    }
  }, [session, isPending]);

  async function linkAndContinue() {
    if (!maKh.trim()) return;
    try {
      const result = await apiClient.post<{ matched: boolean; customer?: { customerId?: string } }>(
        "/auth/link-customer",
        { maKh: maKh.trim() },
      );
      if (result?.matched) {
        localStorage.setItem("linked-kh", result.customer?.customerId ?? maKh.trim());
        toast.success(`Đã liên kết mã KH ${maKh.trim()}`);
        window.location.replace("/dashboard");
      } else {
        toast.error("Không tìm thấy mã KH trong hệ thống");
      }
    } catch {
      toast.error("Lỗi kết nối — thử lại");
    }
  }

  function skip() {
    localStorage.setItem("linked-kh", "skip");
    window.location.replace("/dashboard");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-foam">
      {/* Auth hero */}
      <div className="bg-gradient-to-br from-deep to-aqua px-6 pb-8 pt-16 text-center text-white">
        <div className="mx-auto mb-4 flex h-[70px] w-[70px] items-center justify-center rounded-[22px] bg-white/20">
          <QrCode className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold">Liên kết mã khách hàng</h2>
        <p className="mt-1.5 text-[13.5px] opacity-90">Bước cuối để bắt đầu</p>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pt-6">
        {/* QR scan box (decorative) */}
        <button
          type="button"
          onClick={() => toast("Mở camera quét QR — demo")}
          className="mb-5 flex h-[180px] w-full flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-aqua bg-aqua-soft text-center text-deep active:scale-[0.99]"
        >
          <QrCode className="mb-2 h-10 w-10" />
          <div className="font-bold">Quét mã QR trên hóa đơn cũ</div>
          <div className="mt-1 text-xs opacity-80">Đưa mã trên tờ hóa đơn giấy vào khung</div>
        </button>

        {/* Manual input */}
        <label className="mb-2 block text-[12.5px] font-semibold text-muted-foreground">
          Hoặc nhập mã khách hàng thủ công
        </label>
        <Input
          value={maKh}
          onChange={(e) => setMaKh(e.target.value)}
          placeholder="VD: QN-0912345"
          className="h-[52px] rounded-[13px] text-base"
        />

        <button
          type="button"
          onClick={linkAndContinue}
          disabled={!maKh.trim()}
          className="mt-5 h-[52px] w-full rounded-[14px] bg-deep text-[15.5px] font-extrabold text-white disabled:opacity-50 active:scale-[0.99]"
        >
          Liên kết & bắt đầu
        </button>

        <button
          type="button"
          onClick={skip}
          className="mt-3 w-full text-center text-[13.5px] font-semibold text-aqua"
        >
          Bỏ qua — liên kết sau
        </button>

        <p className="mt-5 text-center text-[12.5px] leading-relaxed text-muted-foreground">
          Hệ thống xác minh mã KH với Customer 360 &amp; Hóa đơn trước khi liên kết vào tài khoản của bạn.
        </p>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Xác thực bảo mật bởi better-auth
        </div>
      </div>
    </div>
  );
}
