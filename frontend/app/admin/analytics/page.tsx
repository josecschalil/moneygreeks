"use client";

import { useEffect, useState } from "react";
import { 
  BarChart2, 
  Users, 
  Eye, 
  Activity, 
  Clock, 
  Bot,
  Filter,
  Monitor,
  Smartphone,
  Tablet,
  Globe
} from "lucide-react";

interface AnalyticsSummary {
  total_views: number;
  human_views: number;
  bot_views: number;
  unique_visitors: number;
  unique_sessions: number;
  bot_pct: number;
}

interface AnalyticsByType {
  page_type: string;
  total: number;
  humans: number;
  bots: number;
  unique: number;
}

interface AnalyticsTopPost {
  page_type: string;
  page_slug: string;
  page_title: string;
  total: number;
  humans: number;
  bots: number;
  unique: number;
}

interface AnalyticsDailyTrend {
  day: string;
  total: number;
  humans: number;
  bots: number;
  unique: number;
}

interface AnalyticsBotBreakdown {
  bot_name: string;
  count: number;
}

interface AnalyticsDeviceBreakdown {
  device_type: string;
  count: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  by_type: AnalyticsByType[];
  top_posts: AnalyticsTopPost[];
  daily_trend: AnalyticsDailyTrend[];
  bot_breakdown: AnalyticsBotBreakdown[];
  device_breakdown: AnalyticsDeviceBreakdown[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/?period=${period}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex justify-center items-center h-full">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load analytics</h2>
          <p className="text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const { summary, by_type, top_posts, daily_trend, bot_breakdown, device_breakdown } = data;

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <BarChart2 className="text-blue-600" />
              Advanced Analytics
            </h1>
            <p className="text-gray-500 mt-2">Monitor traffic, user engagement, and crawler activity across your platform.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {["7d", "30d", "90d", "all"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  period === p 
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p === "all" ? "All Time" : `Last ${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Human Views" 
            value={summary.human_views.toLocaleString()} 
            icon={<Eye className="text-blue-600" size={24} />}
            subtitle={`${summary.total_views.toLocaleString()} total requests`}
          />
          <MetricCard 
            title="Unique Visitors" 
            value={summary.unique_visitors.toLocaleString()} 
            icon={<Users className="text-emerald-600" size={24} />}
            subtitle="Verified human IPs"
          />
          <MetricCard 
            title="Active Sessions" 
            value={summary.unique_sessions.toLocaleString()} 
            icon={<Activity className="text-purple-600" size={24} />}
            subtitle="Current active periods"
          />
          <MetricCard 
            title="Bot Traffic" 
            value={`${summary.bot_pct}%`} 
            icon={<Bot className="text-orange-600" size={24} />}
            subtitle={`${summary.bot_views.toLocaleString()} filtered bot hits`}
            trend="down"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Daily Trend Chart (Simple CSS implementation) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity size={18} className="text-gray-500" /> Traffic Trend
              </h2>
              {daily_trend.length > 0 ? (
                <div className="h-64 flex items-end gap-2 overflow-x-auto pb-2">
                  {daily_trend.map((day, i) => {
                    const maxHumans = Math.max(...daily_trend.map(d => d.humans), 1);
                    const heightPct = Math.max(5, (day.humans / maxHumans) * 100);
                    const isToday = i === daily_trend.length - 1;
                    
                    return (
                      <div key={day.day} className="flex flex-col items-center flex-shrink-0 group w-10">
                        <div className="relative w-full flex justify-center h-full items-end pb-2">
                          <div 
                            className={`w-6 rounded-t-sm transition-all duration-300 ${isToday ? 'bg-blue-600' : 'bg-blue-400 group-hover:bg-blue-500'}`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none">
                            {day.day}: {day.humans} views
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate w-full text-center">
                          {new Date(day.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No trend data available for this period.</div>
              )}
            </div>

            {/* Top Posts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} className="text-gray-500" /> Top Performing Content
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Page Title</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Human Views</th>
                      <th className="px-6 py-4 text-right">Unique</th>
                      <th className="px-6 py-4 text-right">Bot Hits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {top_posts.length > 0 ? (
                      top_posts.map((post, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={post.page_title || post.page_slug}>
                            {post.page_title || post.page_slug || "Unknown Page"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              {post.page_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-blue-600">{post.humans.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-gray-600">{post.unique.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-orange-500 text-xs">{post.bots.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No content data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Area - 1/3 width */}
          <div className="space-y-8">
            
            {/* Breakdown by Type */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Content Type Breakdown</h2>
              <div className="space-y-4">
                {by_type.map((type, i) => {
                  const maxVal = Math.max(...by_type.map(t => t.humans), 1);
                  const width = `${(type.humans / maxVal) * 100}%`;
                  
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 capitalize">{type.page_type.replace('_', ' ')}</span>
                        <span className="text-gray-500">{type.humans.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Device Overview</h2>
              <div className="space-y-4">
                {device_breakdown.map((dev, i) => {
                  let Icon = Globe;
                  if (dev.device_type === "Mobile") Icon = Smartphone;
                  if (dev.device_type === "Tablet") Icon = Tablet;
                  if (dev.device_type === "Desktop") Icon = Monitor;
                  
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                          <Icon size={18} />
                        </div>
                        <span className="font-medium text-gray-700">{dev.device_type || "Unknown"}</span>
                      </div>
                      <span className="font-bold text-gray-900">{dev.count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bot Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Bot size={18} className="text-orange-500"/> Crawler Analysis
              </h2>
              <div className="space-y-3">
                {bot_breakdown.length > 0 ? bot_breakdown.map((bot, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2" title={bot.bot_name}>{bot.bot_name}</span>
                    <span className="bg-orange-50 text-orange-700 font-medium px-2 py-0.5 rounded text-xs">{bot.count.toLocaleString()} hits</span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No bot activity detected.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, subtitle, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full opacity-50 pointer-events-none"></div>
    </div>
  );
}
