"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle, XCircle, AlertTriangle, RefreshCcw } from "lucide-react";

interface ApiSystemLog {
  id: number;
  api_name: string;
  status: "ok" | "error" | "rate_limited";
  error_message: string;
  last_checked: string;
  is_failing: boolean;
}

export default function SystemStatusPage() {
  const [logs, setLogs] = useState<ApiSystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-system-logs/`
      );
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching system logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLogs();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="text-green-500" size={24} />;
      case "rate_limited":
        return <AlertTriangle className="text-yellow-500" size={24} />;
      case "error":
      default:
        return <XCircle className="text-red-500" size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold tracking-wide flex items-center gap-1">
            OK
          </span>
        );
      case "rate_limited":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold tracking-wide flex items-center gap-1">
            <AlertTriangle size={14} /> RATE LIMITED
          </span>
        );
      case "error":
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold tracking-wide">
            ERROR
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            System Status
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor the real-time health of external APIs and background tasks.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {logs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            No system logs found yet. They will appear here once external APIs are hit.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                log.is_failing ? "border-red-200 shadow-red-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(log.status)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{log.api_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Last Checked: {new Date(log.last_checked).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(log.status)}</div>
              </div>
              
              {log.is_failing && log.error_message && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm font-mono text-red-800 break-words whitespace-pre-wrap">
                    {log.error_message}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
