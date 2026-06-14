"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, AlertCircle } from "lucide-react";

import { Suspense } from "react";

function ReportEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editSlug = searchParams.get("slug");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editSlug);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    title: "",
    status: "draft",
    image_url: "",
    overall_conclusion: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [globalIndices, setGlobalIndices] = useState<any[]>([]);
  const [indianIndices, setIndianIndices] = useState<any[]>([]);
  const [institutionalFlows, setInstitutionalFlows] = useState<any[]>([]);
  const [optionChainSummaries, setOptionChainSummaries] = useState<any[]>([]);
  const [stockMovers, setStockMovers] = useState<any[]>([]);
  const [sectorPerformance, setSectorPerformance] = useState<any[]>([]);

  const [globalAnalysis, setGlobalAnalysis] = useState<any>({});
  const [indianAnalysis, setIndianAnalysis] = useState<any>({});
  const [institutionalAnalysis, setInstitutionalAnalysis] = useState<any>({});
  const [stockMoverAnalysis, setStockMoverAnalysis] = useState<any>({});
  const [sectorAnalysis, setSectorAnalysis] = useState<any>({});
  const [marketBreadth, setMarketBreadth] = useState<any>({});

  const [originalData, setOriginalData] = useState<any>({});

  useEffect(() => {
    if (editSlug) {
      fetchReportData();
    } else {
      router.push("/admin/reports");
    }
  }, [editSlug]);

  const fetchReportData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/reports/${editSlug}/`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || "",
          status: data.status || "draft",
          image_url: data.image_url || "",
          overall_conclusion: data.overall_conclusion || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          meta_keywords: data.meta_keywords || "",
        });
        
        setGlobalIndices(data.global_indices || []);
        setIndianIndices(data.indian_indices || []);
        setInstitutionalFlows(data.institutional_flows || []);
        setOptionChainSummaries(data.option_chain_summaries || []);
        setStockMovers(data.stock_movers || []);
        setSectorPerformance(data.sector_performance || []);

        setGlobalAnalysis(data.global_analysis || {});
        setIndianAnalysis(data.indian_analysis || {});
        setInstitutionalAnalysis(data.institutional_analysis || {});
        setStockMoverAnalysis(data.stock_mover_analysis || {});
        setSectorAnalysis(data.sector_analysis || {});
        setMarketBreadth(data.market_breadth || {});

        setOriginalData({
          globalIndices: JSON.parse(JSON.stringify(data.global_indices || [])),
          indianIndices: JSON.parse(JSON.stringify(data.indian_indices || [])),
          institutionalFlows: JSON.parse(JSON.stringify(data.institutional_flows || [])),
          optionChainSummaries: JSON.parse(JSON.stringify(data.option_chain_summaries || [])),
          stockMovers: JSON.parse(JSON.stringify(data.stock_movers || [])),
          sectorPerformance: JSON.parse(JSON.stringify(data.sector_performance || [])),
          globalAnalysis: JSON.parse(JSON.stringify(data.global_analysis || {})),
          indianAnalysis: JSON.parse(JSON.stringify(data.indian_analysis || {})),
          institutionalAnalysis: JSON.parse(JSON.stringify(data.institutional_analysis || {})),
          stockMoverAnalysis: JSON.parse(JSON.stringify(data.stock_mover_analysis || {})),
          sectorAnalysis: JSON.parse(JSON.stringify(data.sector_analysis || {})),
          marketBreadth: JSON.parse(JSON.stringify(data.market_breadth || {})),
        });
      } else {
        setError("Failed to fetch report data for editing.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching report data.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (setter: any, id: number, field: string, value: any) => {
    setter((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleObjectChange = (setter: any, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/reports/${editSlug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save general report data.");

      const patchModifiedItems = async (endpoint: string, currentItems: any[], originalItems: any[]) => {
        const promises = currentItems.map(async (item) => {
          const original = originalItems.find((o) => o.id === item.id);
          if (original && JSON.stringify(original) !== JSON.stringify(item)) {
            const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/${endpoint}/${item.id}/`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
            if (!patchRes.ok) throw new Error(`Failed to update item in ${endpoint}`);
          }
        });
        await Promise.all(promises);
      };

      const patchModifiedObject = async (endpoint: string, currentObj: any, originalObj: any) => {
        if (currentObj && currentObj.id && JSON.stringify(currentObj) !== JSON.stringify(originalObj)) {
          const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/${endpoint}/${currentObj.id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentObj),
          });
          if (!patchRes.ok) throw new Error(`Failed to update object in ${endpoint}`);
        }
      };

      await Promise.all([
        patchModifiedItems("global-indices", globalIndices, originalData.globalIndices),
        patchModifiedItems("indian-indices", indianIndices, originalData.indianIndices),
        patchModifiedItems("institutional-flows", institutionalFlows, originalData.institutionalFlows),
        patchModifiedItems("option-chain-summaries", optionChainSummaries, originalData.optionChainSummaries),
        patchModifiedItems("stock-movers", stockMovers, originalData.stockMovers),
        patchModifiedItems("sector-performance", sectorPerformance, originalData.sectorPerformance),

        patchModifiedObject("global-analysis", globalAnalysis, originalData.globalAnalysis),
        patchModifiedObject("indian-analysis", indianAnalysis, originalData.indianAnalysis),
        patchModifiedObject("institutional-analysis", institutionalAnalysis, originalData.institutionalAnalysis),
        patchModifiedObject("stock-mover-analysis", stockMoverAnalysis, originalData.stockMoverAnalysis),
        patchModifiedObject("sector-analysis", sectorAnalysis, originalData.sectorAnalysis),
        patchModifiedObject("market-breadth", marketBreadth, originalData.marketBreadth),
      ]);

      setSuccess(true);
      setTimeout(() => router.push("/admin/reports"), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save report. Some changes might not have been applied.");
    } finally {
      setLoading(false);
    }
  };

  if (!editSlug && !fetching) {
    return <div className="p-8">Redirecting...</div>;
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "indices", label: "Indices" },
    { id: "analyses", label: "Analyses Texts" },
    { id: "flows_options", label: "Flows & Options" },
    { id: "market_internals", label: "Market Internals" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Complete Report Editor</h1>
            <p className="text-gray-500 mt-1">Edit every single data point of the pre-market report.</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save All Changes"}
          </button>
        </div>

        {fetching ? (
          <div className="text-center py-12 text-gray-500">Loading complete report data...</div>
        ) : (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Complete Report updated successfully! Redirecting...
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              <div className="p-6 md:p-8">
                
                {/* General Tab */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Conclusion</label>
                        <textarea
                          name="overall_conclusion"
                          value={formData.overall_conclusion}
                          onChange={handleChange}
                          rows={8}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                        />
                      </div>
                      <div className="col-span-2 mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                              name="meta_title"
                              value={formData.meta_title}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Custom SEO Title"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                              name="meta_description"
                              value={formData.meta_description}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                              placeholder="Short summary for search engines"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                            <input
                              name="meta_keywords"
                              value={formData.meta_keywords}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Comma separated keywords"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Indices Tab */}
                {activeTab === "indices" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Global Markets</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-3">Index Name</th>
                              <th className="px-4 py-3">Prev Close</th>
                              <th className="px-4 py-3">LTP (Open)</th>
                              <th className="px-4 py-3">Change</th>
                              <th className="px-4 py-3">Change %</th>
                              <th className="px-4 py-3">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {globalIndices.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-4 py-2"><input value={item.index_name} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "index_name", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.prev_close} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "prev_close", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.open_price} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "open_price", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.change} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "change", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.change_percent} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "change_percent", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2">
                                  <select value={item.trend} onChange={(e) => handleArrayChange(setGlobalIndices, item.id, "trend", e.target.value)} className="w-full px-2 py-1 border rounded">
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Indian Markets</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-3">Index Name</th>
                              <th className="px-4 py-3">Prev Close</th>
                              <th className="px-4 py-3">LTP (Open)</th>
                              <th className="px-4 py-3">Change</th>
                              <th className="px-4 py-3">Change %</th>
                              <th className="px-4 py-3">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {indianIndices.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-4 py-2"><input value={item.index_name} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "index_name", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.prev_close} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "prev_close", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.open_price} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "open_price", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.change} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "change", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.change_percent} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "change_percent", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2">
                                  <select value={item.trend} onChange={(e) => handleArrayChange(setIndianIndices, item.id, "trend", e.target.value)} className="w-full px-2 py-1 border rounded">
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analyses Tab */}
                {activeTab === "analyses" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Global Analysis</label>
                        <textarea value={globalAnalysis.analysis || ""} onChange={(e) => handleObjectChange(setGlobalAnalysis, "analysis", e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Indian Analysis</label>
                        <textarea value={indianAnalysis.analysis || ""} onChange={(e) => handleObjectChange(setIndianAnalysis, "analysis", e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Flow Analysis</label>
                        <textarea value={institutionalAnalysis.analysis || ""} onChange={(e) => handleObjectChange(setInstitutionalAnalysis, "analysis", e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mover Analysis</label>
                        <textarea value={stockMoverAnalysis.analysis || ""} onChange={(e) => handleObjectChange(setStockMoverAnalysis, "analysis", e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sector Analysis</label>
                        <textarea value={sectorAnalysis.analysis || ""} onChange={(e) => handleObjectChange(setSectorAnalysis, "analysis", e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Flows & Options Tab */}
                {activeTab === "flows_options" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Institutional Flows</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-3">Institution</th>
                              <th className="px-4 py-3">Buy Value</th>
                              <th className="px-4 py-3">Sell Value</th>
                              <th className="px-4 py-3">Net Value</th>
                              <th className="px-4 py-3">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {institutionalFlows.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-4 py-2"><input value={item.institution_type} onChange={(e) => handleArrayChange(setInstitutionalFlows, item.id, "institution_type", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.buy_value} onChange={(e) => handleArrayChange(setInstitutionalFlows, item.id, "buy_value", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.sell_value} onChange={(e) => handleArrayChange(setInstitutionalFlows, item.id, "sell_value", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2"><input type="number" step="0.01" value={item.net_value} onChange={(e) => handleArrayChange(setInstitutionalFlows, item.id, "net_value", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                                <td className="px-4 py-2">
                                  <select value={item.trend} onChange={(e) => handleArrayChange(setInstitutionalFlows, item.id, "trend", e.target.value)} className="w-full px-2 py-1 border rounded">
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Option Chain Summaries</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-2 py-3">Symbol</th>
                              <th className="px-2 py-3">PCR</th>
                              <th className="px-2 py-3">Max Call OI Strike</th>
                              <th className="px-2 py-3">Max Put OI Strike</th>
                              <th className="px-2 py-3">Underlying</th>
                              <th className="px-2 py-3">Analysis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {optionChainSummaries.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-2 py-2"><input value={item.symbol} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "symbol", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-2 py-2"><input type="number" step="0.01" value={item.pcr || ""} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "pcr", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-2 py-2"><input type="number" step="0.01" value={item.max_call_oi_strike || ""} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "max_call_oi_strike", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-2 py-2"><input type="number" step="0.01" value={item.max_put_oi_strike || ""} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "max_put_oi_strike", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-2 py-2"><input type="number" step="0.01" value={item.underlying_value || ""} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "underlying_value", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-2 py-2"><textarea value={item.analysis || ""} onChange={(e) => handleArrayChange(setOptionChainSummaries, item.id, "analysis", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" rows={2}/></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Internals Tab */}
                {activeTab === "market_internals" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Market Breadth</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Advancing</label>
                          <input type="number" value={marketBreadth.advancing || ""} onChange={(e) => handleObjectChange(setMarketBreadth, "advancing", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Declining</label>
                          <input type="number" value={marketBreadth.declining || ""} onChange={(e) => handleObjectChange(setMarketBreadth, "declining", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">A/D Ratio</label>
                          <input type="number" step="0.01" value={marketBreadth.advance_decline_ratio || ""} onChange={(e) => handleObjectChange(setMarketBreadth, "advance_decline_ratio", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Movers</h2>
                      <div className="overflow-x-auto h-64 overflow-y-scroll border rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 relative">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Symbol</th>
                              <th className="px-4 py-3">Prev Close</th>
                              <th className="px-4 py-3">LTP</th>
                              <th className="px-4 py-3">Change %</th>
                              <th className="px-4 py-3">Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stockMovers.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-4 py-1">
                                  <select value={item.category} onChange={(e) => handleArrayChange(setStockMovers, item.id, "category", e.target.value)} className="w-full px-2 py-1 border rounded text-xs">
                                    <option value="gainer">Gainer</option>
                                    <option value="loser">Loser</option>
                                  </select>
                                </td>
                                <td className="px-4 py-1"><input value={item.symbol} onChange={(e) => handleArrayChange(setStockMovers, item.id, "symbol", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input type="number" step="0.01" value={item.prev_close} onChange={(e) => handleArrayChange(setStockMovers, item.id, "prev_close", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input type="number" step="0.01" value={item.open_price} onChange={(e) => handleArrayChange(setStockMovers, item.id, "open_price", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input type="number" step="0.01" value={item.change_percent} onChange={(e) => handleArrayChange(setStockMovers, item.id, "change_percent", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input value={item.volume} onChange={(e) => handleArrayChange(setStockMovers, item.id, "volume", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Sector Performance</h2>
                      <div className="overflow-x-auto h-64 overflow-y-scroll border rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 relative">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Sector</th>
                              <th className="px-4 py-3">LTP</th>
                              <th className="px-4 py-3">Change %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectorPerformance.map((item) => (
                              <tr key={item.id} className="border-b bg-white">
                                <td className="px-4 py-1">
                                  <select value={item.category} onChange={(e) => handleArrayChange(setSectorPerformance, item.id, "category", e.target.value)} className="w-full px-2 py-1 border rounded text-xs">
                                    <option value="gainer">Gainer</option>
                                    <option value="loser">Loser</option>
                                  </select>
                                </td>
                                <td className="px-4 py-1"><input value={item.sector_name} onChange={(e) => handleArrayChange(setSectorPerformance, item.id, "sector_name", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input type="number" step="0.01" value={item.prev_close} onChange={(e) => handleArrayChange(setSectorPerformance, item.id, "prev_close", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                                <td className="px-4 py-1"><input type="number" step="0.01" value={item.change_percent} onChange={(e) => handleArrayChange(setSectorPerformance, item.id, "change_percent", e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}
                
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReportEditor() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
      <ReportEditorInner />
    </Suspense>
  );
}
