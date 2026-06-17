"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Edit, PlayCircle } from "lucide-react";

export default function ReportsManagement() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/report-list/`,
      );
      if (res.ok) {
        const data = await res.json();
        setReports(data.results || data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-report/`,
        {
          method: "POST",
        },
      );
      if (res.ok) {
        alert("Report generated successfully!");
        fetchReports();
        // ✅ Fixed — read as text first, try to parse as JSON
      } else {
        const text = await res.text();
        let message = "Unknown error";
        try {
          const errData = JSON.parse(text);
          message = errData.error || errData.detail || message;
        } catch {
          // Django returned HTML — log it, show generic message
          console.error("Non-JSON error response:", text.slice(0, 500));
        }
        alert("Failed to generate report: " + message);
      }
    } catch (err) {
      console.error("Error generating report", err);
      alert("Error generating report");
    } finally {
      setGenerating(false);
    }
  };

  const deleteReport = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${slug}/`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        fetchReports();
      } else {
        alert("Failed to delete report");
      }
    } catch (err) {
      console.error("Error deleting report", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            Pre-Market Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and generate daily market analysis reports.
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <PlayCircle size={18} />
          {generating ? "Generating..." : "Generate Today's Report"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading reports...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Report Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Quality Score
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr
                    key={report.slug}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {report.report_date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{report.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {report.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${report.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {report.quality_score}/100
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/report-editor?slug=${report.slug}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteReport(report.slug)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No reports found. Generate one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
