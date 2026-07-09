import { useState } from "react";
import { Link } from "react-router";
import {
  Users, BookOpen, BarChart3, Shield, Trash2, Search,
  CheckCircle, XCircle, ChevronRight, TrendingUp, Eye,
  Flag, RefreshCw
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cn } from "../../lib/utils";
import { MOCK_SETS } from "../../data/mockData";

type AdminTab = "overview" | "users" | "sets" | "reports";

const MOCK_USERS = [
  { _id: "1", name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", role: "user", streak: 12, createdAt: "2026-01-15", sets: 5 },
  { _id: "2", name: "Trần Thị B", email: "tranthib@gmail.com", role: "premium", streak: 30, createdAt: "2025-12-01", sets: 18 },
  { _id: "3", name: "Lê Văn C", email: "levanc@gmail.com", role: "admin", streak: 7, createdAt: "2025-11-20", sets: 2 },
  { _id: "4", name: "Phạm Thị D", email: "phamthid@gmail.com", role: "user", streak: 0, createdAt: "2026-06-10", sets: 0 },
  { _id: "5", name: "Hoàng Văn E", email: "hoangvane@gmail.com", role: "user", streak: 45, createdAt: "2025-09-05", sets: 11 },
];

const MOCK_REPORTS = [
  { _id: "1", reason: "Nội dung không phù hợp", reporter: "User123", target: "IELTS Vocabulary Set", createdAt: "2026-07-05", status: "pending" },
  { _id: "2", reason: "Thông tin sai lệch", reporter: "User456", target: "Biology Chapter 1", createdAt: "2026-07-04", status: "resolved" },
  { _id: "3", reason: "Spam", reporter: "User789", target: "Random Set #42", createdAt: "2026-07-06", status: "pending" },
];

const OVERVIEW_STATS = [
  { label: "Tổng người dùng", value: "12,847", change: "+8%", icon: <Users className="w-5 h-5" />, color: "text-primary" },
  { label: "Bộ thẻ công khai", value: "3,291", change: "+12%", icon: <BookOpen className="w-5 h-5" />, color: "text-success" },
  { label: "Phiên học hôm nay", value: "1,042", change: "+5%", icon: <TrendingUp className="w-5 h-5" />, color: "text-info" },
  { label: "Báo cáo chờ duyệt", value: "3", change: "-2", icon: <Flag className="w-5 h-5" />, color: "text-destructive" },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [setSearch, setSetSearch] = useState("");

  const filteredUsers = MOCK_USERS.filter(
    u => u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
         u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredSets = MOCK_SETS.filter(
    s => s.name.toLowerCase().includes(setSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Quản lý toàn bộ hệ thống Kairo</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
            <Shield className="w-4 h-4" />
            Quyền Admin
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted rounded-2xl p-1.5 mb-8 w-fit">
          {(["overview", "users", "sets", "reports"] as AdminTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "overview" ? "Tổng quan" : t === "users" ? "Người dùng" : t === "sets" ? "Bộ thẻ" : "Báo cáo"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {OVERVIEW_STATS.map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className={cn("mb-3", stat.color)}>{stat.icon}</div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-success">{stat.change}</span>
                    <span className="text-xs text-muted-foreground">so với tuần trước</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Người dùng mới</h3>
                  <button onClick={() => setTab("users")} className="text-xs text-primary hover:underline flex items-center gap-1">
                    Xem tất cả <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_USERS.slice(0, 4).map(user => (
                    <div key={user._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        user.role === "admin" ? "bg-destructive/10 text-destructive" :
                        user.role === "premium" ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-muted text-muted-foreground"
                      )}>{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Báo cáo cần xử lý</h3>
                  <button onClick={() => setTab("reports")} className="text-xs text-primary hover:underline flex items-center gap-1">
                    Xem tất cả <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_REPORTS.filter(r => r.status === "pending").map(report => (
                    <div key={report._id} className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{report.target}</p>
                        <p className="text-xs text-muted-foreground">{report.reason}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-1 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="w-4 h-4" /> Làm mới
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {["Người dùng", "Role", "Streak", "Bộ thẻ", "Ngày tham gia", "Thao tác"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t border-border hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          user.role === "admin" ? "bg-destructive/10 text-destructive" :
                          user.role === "premium" ? "bg-yellow-500/10 text-yellow-600" :
                          "bg-muted text-muted-foreground"
                        )}>{user.role}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">🔥 {user.streak}</td>
                      <td className="px-5 py-4 text-sm text-foreground">{user.sets}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sets Tab */}
        {tab === "sets" && (
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm bộ thẻ..."
                  value={setSearch}
                  onChange={(e) => setSetSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {["Tên bộ thẻ", "Tác giả", "Thẻ", "Lượt thích", "Trạng thái", "Thao tác"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSets.map((set) => (
                    <tr key={set._id} className="border-t border-border hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4">
                        <Link to={`/sets/${set._id}`} className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                          {set.name}
                        </Link>
                        {set.description && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{set.description}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{set.author?.name || "—"}</td>
                      <td className="px-5 py-4 text-sm text-foreground">{set.totalCards}</td>
                      <td className="px-5 py-4 text-sm text-foreground">❤️ {set.favoriteCount}</td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          set.isPublic ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}>{set.isPublic ? "Công khai" : "Riêng tư"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/sets/${set._id}`} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {tab === "reports" && (
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {["Nội dung bị báo cáo", "Lý do", "Người báo cáo", "Ngày", "Trạng thái", "Thao tác"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REPORTS.map((report) => (
                    <tr key={report._id} className="border-t border-border hover:bg-accent/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-sm text-foreground">{report.target}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{report.reason}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{report.reporter}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          report.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                        )}>{report.status === "pending" ? "Chờ duyệt" : "Đã xử lý"}</span>
                      </td>
                      <td className="px-5 py-4">
                        {report.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors" title="Chấp nhận">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" title="Bác bỏ">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
