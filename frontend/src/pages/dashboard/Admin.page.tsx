import { ShieldCheck, Users, Trophy, Sparkles, BarChart2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cn } from "../../lib/utils";

const ADMIN_ACTIONS = [
  {
    label: "Quản lý người dùng",
    value: "Theo dõi người dùng, phân quyền, xử lý khiếu nại",
    icon: Users,
  },
  {
    label: "Báo cáo hệ thống",
    value: "Xem thống kê hoạt động, lỗi và hiệu suất",
    icon: BarChart2,
  },
  {
    label: "Phê duyệt nội dung",
    value: "Quản lý bộ thẻ, đánh giá và báo cáo vi phạm",
    icon: ShieldCheck,
  },
  {
    label: "Gamification",
    value: "Thiết lập thưởng, sự kiện và bảng xếp hạng",
    icon: Trophy,
  },
];

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-[0.24em] mb-2">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Bảng điều khiển quản trị
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Quản lý người dùng, nội dung và các báo cáo hệ thống từ một nơi.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Quyền quản trị</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              Toàn quyền truy cập
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Quản lý nội dung, người dùng và thiết lập hệ thống.
            </p>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          {ADMIN_ACTIONS.map((action) => (
            <div
              key={action.label}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-card transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-4 text-primary">
                <action.icon className="w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">
                  {action.label}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">{action.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Tổng quan nhanh
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Cập nhật
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Người dùng hoạt động",
                value: "12.4k",
                tone: "bg-primary/10",
              },
              { label: "Bộ thẻ báo cáo", value: "86", tone: "bg-warning/10" },
              {
                label: "Phiên truy cập",
                value: "24.3k",
                tone: "bg-secondary/10",
              },
              { label: "Sự kiện mới", value: "14", tone: "bg-success/10" },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-3xl p-5 border border-border",
                  item.tone,
                )}
              >
                <p className="text-sm text-muted-foreground mb-2">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
