import Link from "next/link";
import {
  Home,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
  Newspaper,
  Layers,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link
            href="/admin"
            className="text-xl font-serif font-bold text-blue-600 tracking-tight"
          >
            MoneyGreeks
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Home size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/education"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
          >
            <BookOpen size={20} />
            Education Content
          </Link>
          <Link
            href="/admin/education-categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Layers size={20} />
            Education Categories
          </Link>
          <Link
            href="/admin/news"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Newspaper size={20} />
            News Articles
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
          >
            <BarChart2 size={20} />
            Pre-Market Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors font-medium"
          >
            <LogOut size={20} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
