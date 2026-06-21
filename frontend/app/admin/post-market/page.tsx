"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, FileJson, FormInput, Save } from "lucide-react";

const JSON_TEMPLATE = `{
  "marketSummary": {
    "indices": [
      { "name": "Nifty 50", "close": 24521.35, "change": 148.20, "changePct": 0.61, "direction": "up" },
      { "name": "Sensex", "close": 80684.45, "change": 497.30, "changePct": 0.62, "direction": "up" },
      { "name": "Bank Nifty", "close": 52318.70, "change": -112.55, "changePct": -0.22, "direction": "down" },
      { "name": "Nifty Midcap 100", "close": 57843.20, "change": 320.45, "changePct": 0.56, "direction": "up" },
      { "name": "Nifty Smallcap 100", "close": 18921.30, "change": 89.75, "changePct": 0.48, "direction": "up" },
      { "name": "India VIX", "close": 13.42, "change": -0.38, "changePct": -2.75, "direction": "down" }
    ],
    "breadth": {
      "advances": 1847,
      "declines": 894,
      "unchanged": 121,
      "ratio": "2.07:1",
      "sentiment": "Bullish"
    }
  },
  "topGainers": [
    { "symbol": "INFY", "name": "Infosys", "price": 1634.50, "change": 3.82 },
    { "symbol": "TCS", "name": "Tata Consultancy", "price": 3512.20, "change": 2.91 }
  ],
  "topLosers": [
    { "symbol": "BAJFINANCE", "name": "Bajaj Finance", "price": 6821.30, "change": -2.34 },
    { "symbol": "AXISBANK", "name": "Axis Bank", "price": 1089.45, "change": -1.87 }
  ],
  "volumeShockers": [
    { "symbol": "ZOMATO", "name": "Zomato", "volume": "4.2x", "remark": "Breakout candle on high delivery" }
  ],
  "circuitStocks": {
    "upperCircuit": ["RAILTEL", "RITES"],
    "lowerCircuit": ["YESBANK", "SUZLON"]
  },
  "fiidii": {
    "fii": { "buy": 14823.42, "sell": 12104.67, "net": 2718.75, "activity": "Net Buyers" },
    "dii": { "buy": 8932.10, "sell": 10218.45, "net": -1286.35, "activity": "Net Sellers" },
    "note": "FII turned net buyers for the 3rd consecutive session.",
    "derivativesNote": "FII net long in index futures."
  },
  "sectors": [
    { "name": "Nifty IT", "change": 2.34, "direction": "up", "leader": "INFY (+3.8%)" }
  ],
  "fo": {
    "nifty": {
      "spot": 24521.35,
      "futuresClose": 24538.10,
      "basis": 16.75,
      "pcr": 1.18,
      "maxPain": 24500,
      "ivPercentile": "34th"
    },
    "bankNifty": {
      "spot": 52318.70,
      "futuresClose": 52344.20,
      "basis": 25.50,
      "pcr": 0.94,
      "maxPain": 52000,
      "ivPercentile": "41st"
    },
    "oiActivity": [
      { "strike": "24600 CE", "oi": "High Call OI", "interpretation": "Strong resistance zone" }
    ],
    "activeOptions": [
      { "instrument": "NIFTY 24500 CE", "volume": "18.4L", "oi": "42.1L" }
    ]
  },
  "global": {
    "us": [
      { "name": "Dow Jones", "value": "42,841", "change": 0.34, "direction": "up" }
    ],
    "asia": [
      { "name": "Nikkei 225", "value": "38,648", "change": -0.21, "direction": "down" }
    ],
    "commodities": [
      { "name": "Crude Oil (Brent)", "value": "$82.40", "change": 0.31, "direction": "up" }
    ]
  },
  "corporateActions": [
    { "event": "Results", "company": "TCS Q1FY27", "detail": "Revenue ₹63,437 Cr, up 4.4% YoY. PAT ₹12,760 Cr." }
  ],
  "analystCalls": [
    { "broker": "Morgan Stanley", "stock": "INFY", "action": "Upgrade", "target": "₹1,820", "prev": "Neutral → Overweight" }
  ],
  "technical": {
    "nifty": {
      "bias": "Bullish",
      "support": ["24,400", "24,280", "24,150"],
      "resistance": ["24,600", "24,720", "24,880"],
      "pattern": "Bullish engulfing candle formed on daily chart."
    },
    "bankNifty": {
      "bias": "Neutral",
      "support": ["52,000", "51,750", "51,400"],
      "resistance": ["52,500", "52,800", "53,200"],
      "pattern": "Range-bound near 52,000–52,500."
    },
    "watchlist": [
      { "symbol": "INFY", "setup": "Breakout above ₹1,640 with volume. Target ₹1,700." }
    ],
    "conclusion": "The broader trend remains positive."
  },
  "quickSnapshot": [
    { "label": "Market Bias", "value": "Bullish", "color": "text-green-600" },
    { "label": "VIX", "value": "13.42 (Cooling)", "color": "text-green-600" },
    { "label": "Nifty PCR", "value": "1.18 (Bullish)", "color": "text-green-600" },
    { "label": "FII Flow", "value": "Net Buyers", "color": "text-green-600" },
    { "label": "Bank Nifty", "value": "Neutral", "color": "text-yellow-600" },
    { "label": "Breadth", "value": "2.07:1 (Strong)", "color": "text-green-600" }
  ]
}`;

export default function PostMarketAdminPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"form" | "json">("form");
  const [activeFormTab, setActiveFormTab] = useState("summary");
  const [parsedReportData, setParsedReportData] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    report_date: new Date().toISOString().split("T")[0],
    analyst: "Jose C S",
    analyst_designation: "Founder & Head Analyst, MoneyGreeks",
    overall_conclusion: "",
    report_data: JSON_TEMPLATE,
    is_published: true,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const fetchReports = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post-market-list/`);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to fetch post market reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (formOpen && !parsedReportData) {
      try {
        setParsedReportData(JSON.parse(formData.report_data));
      } catch (err) {
        setParsedReportData(JSON.parse(JSON_TEMPLATE));
      }
    }
  }, [formOpen, formData.report_data, parsedReportData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSwitchMode = (mode: "form" | "json") => {
    if (mode === "form") {
      try {
        const parsed = JSON.parse(formData.report_data);
        setParsedReportData(parsed);
        setEditMode("form");
      } catch (err) {
        alert("Invalid JSON format! Please resolve any syntax errors in the JSON Editor before switching to Form Editor.");
      }
    } else {
      if (parsedReportData) {
        setFormData((prev) => ({
          ...prev,
          report_data: JSON.stringify(parsedReportData, null, 2),
        }));
      }
      setEditMode("json");
    }
  };

  const updateNestedData = (path: (string | number)[], value: any) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let current = clone;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        if (current[key] === undefined) {
          current[key] = typeof nextKey === "number" ? [] : {};
        }
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const addArrayItem = (path: (string | number)[], newItem: any) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let current = clone;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (current[key] === undefined) {
          current[key] = [];
        }
        current = current[key];
      }
      if (Array.isArray(current)) {
        current.push(newItem);
      }
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const removeArrayItem = (path: (string | number)[], index: number) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let current = clone;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (current[key] === undefined) return prev;
        current = current[key];
      }
      if (Array.isArray(current)) {
        current.splice(index, 1);
      }
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const handleBreadthChange = (field: "advances" | "declines" | "unchanged", value: number) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.marketSummary) clone.marketSummary = {};
      if (!clone.marketSummary.breadth) clone.marketSummary.breadth = {};
      
      clone.marketSummary.breadth[field] = value;
      const adv = clone.marketSummary.breadth.advances || 0;
      const dec = clone.marketSummary.breadth.declines || 0;
      clone.marketSummary.breadth.ratio = `${(adv / (dec || 1)).toFixed(2)}:1`;
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const handleFiiDiiChange = (type: "fii" | "dii", field: "buy" | "sell", value: number) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.fiidii) clone.fiidii = {};
      if (!clone.fiidii[type]) clone.fiidii[type] = {};
      
      clone.fiidii[type][field] = value;
      const buy = clone.fiidii[type].buy || 0;
      const sell = clone.fiidii[type].sell || 0;
      const net = parseFloat((buy - sell).toFixed(2));
      clone.fiidii[type].net = net;
      clone.fiidii[type].activity = net >= 0 ? "Net Buyers" : "Net Sellers";
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const handleFoPriceChange = (indexName: "nifty" | "bankNifty", field: "spot" | "futuresClose", value: number) => {
    setParsedReportData((prev: any) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.fo) clone.fo = {};
      if (!clone.fo[indexName]) clone.fo[indexName] = {};
      
      clone.fo[indexName][field] = value;
      const spot = clone.fo[indexName].spot || 0;
      const futuresClose = clone.fo[indexName].futuresClose || 0;
      clone.fo[indexName].basis = parseFloat((futuresClose - spot).toFixed(2));
      
      setFormData((f) => ({
        ...f,
        report_data: JSON.stringify(clone, null, 2),
      }));
      return clone;
    });
  };

  const handleAddNew = () => {
    setEditingSlug(null);
    setFormData({
      title: "",
      slug: "",
      report_date: new Date().toISOString().split("T")[0],
      analyst: "Jose C S",
      analyst_designation: "Founder & Head Analyst, MoneyGreeks",
      overall_conclusion: "",
      report_data: JSON_TEMPLATE,
      is_published: true,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    });
    setParsedReportData(JSON.parse(JSON_TEMPLATE));
    setEditMode("form");
    setFormOpen(true);
  };

  const handleEdit = (r: any) => {
    setEditingSlug(r.slug);
    setFormData({
      title: r.title,
      slug: r.slug,
      report_date: r.report_date,
      analyst: r.analyst,
      analyst_designation: r.analyst_designation,
      overall_conclusion: r.overall_conclusion || "",
      report_data: JSON.stringify(r.report_data, null, 2),
      is_published: r.is_published,
      meta_title: r.meta_title || "",
      meta_description: r.meta_description || "",
      meta_keywords: r.meta_keywords || "",
    });
    setParsedReportData(r.report_data);
    setEditMode("form");
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let parsedData = {};
      if (editMode === "form") {
        parsedData = parsedReportData;
      } else {
        try {
          parsedData = JSON.parse(formData.report_data);
        } catch (jsonErr) {
          alert("Invalid JSON format in Report Data field.");
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        ...formData,
        report_data: parsedData,
      };

      const url = editingSlug
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/post-market-list/${editingSlug}/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/post-market-list/`;
      const method = editingSlug ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingSlug ? "Report updated successfully!" : "Report added successfully!");
        setFormOpen(false);
        setEditingSlug(null);
        setFormData({
          title: "",
          slug: "",
          report_date: new Date().toISOString().split("T")[0],
          analyst: "Jose C S",
          analyst_designation: "Founder & Head Analyst, MoneyGreeks",
          overall_conclusion: "",
          report_data: JSON_TEMPLATE,
          is_published: true,
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
        });
        setParsedReportData(null);
        fetchReports();
      } else {
        const errorData = await res.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post-market-list/${slug}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchReports();
      } else {
        alert("Failed to delete report.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formTabs = [
    { id: "summary", label: "Market Summary & Breadth" },
    { id: "gainers", label: "Gainers, Losers & Circuits" },
    { id: "fiidii", label: "FII / DII Flows & Sectors" },
    { id: "fo", label: "F&O Analysis" },
    { id: "global", label: "Global Markets & Corporate" },
    { id: "technical", label: "Technicals & Watchlist" },
    { id: "snapshot", label: "Quick Snapshot" },
  ];

  // Tab renders
  const renderSummaryTab = () => {
    const indices = parsedReportData?.marketSummary?.indices || [];
    const breadth = parsedReportData?.marketSummary?.breadth || {};

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Market Indices</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Index Name</th>
                  <th className="p-3 border-b">Close Price</th>
                  <th className="p-3 border-b">Change</th>
                  <th className="p-3 border-b">Change %</th>
                  <th className="p-3 border-b">Direction</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {indices.map((idx: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={idx.name || ""}
                        onChange={(e) => updateNestedData(["marketSummary", "indices", index, "name"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Nifty 50"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="number"
                        step="any"
                        value={idx.close ?? ""}
                        onChange={(e) => updateNestedData(["marketSummary", "indices", index, "close"], parseFloat(e.target.value) || 0)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="24521.35"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="number"
                        step="any"
                        value={idx.change ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          updateNestedData(["marketSummary", "indices", index, "change"], val);
                          updateNestedData(["marketSummary", "indices", index, "direction"], val >= 0 ? "up" : "down");
                        }}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="148.20"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="number"
                        step="any"
                        value={idx.changePct ?? ""}
                        onChange={(e) => updateNestedData(["marketSummary", "indices", index, "changePct"], parseFloat(e.target.value) || 0)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="0.61"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <select
                        value={idx.direction || "up"}
                        onChange={(e) => updateNestedData(["marketSummary", "indices", index, "direction"], e.target.value)}
                        className={`w-full p-1.5 border rounded-md text-sm font-medium border-gray-200 ${
                          idx.direction === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        }`}
                      >
                        <option value="up" className="text-green-600">Up 🟢</option>
                        <option value="down" className="text-red-600">Down 🔴</option>
                      </select>
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["marketSummary", "indices"], index)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["marketSummary", "indices"], { name: "", close: 0, change: 0, changePct: 0, direction: "up" })}
            className="mt-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Index Row
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Market Breadth</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Advances</label>
              <input
                type="number"
                value={breadth.advances ?? ""}
                onChange={(e) => handleBreadthChange("advances", parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-md text-sm border-gray-200"
                placeholder="1847"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Declines</label>
              <input
                type="number"
                value={breadth.declines ?? ""}
                onChange={(e) => handleBreadthChange("declines", parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-md text-sm border-gray-200"
                placeholder="894"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Unchanged</label>
              <input
                type="number"
                value={breadth.unchanged ?? ""}
                onChange={(e) => handleBreadthChange("unchanged", parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-md text-sm border-gray-200"
                placeholder="121"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Advance/Decline Ratio (Calculated: {(breadth.advances / (breadth.declines || 1)).toFixed(2)}:1)
              </label>
              <input
                type="text"
                value={breadth.ratio || ""}
                onChange={(e) => updateNestedData(["marketSummary", "breadth", "ratio"], e.target.value)}
                className="w-full p-2 border rounded-md text-sm border-gray-200"
                placeholder="2.07:1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Sentiment</label>
              <select
                value={breadth.sentiment || "Neutral"}
                onChange={(e) => updateNestedData(["marketSummary", "breadth", "sentiment"], e.target.value)}
                className="w-full p-2 border rounded-md text-sm border-gray-200"
              >
                <option value="Bullish">Bullish</option>
                <option value="Highly Bullish">Highly Bullish</option>
                <option value="Neutral">Neutral</option>
                <option value="Bearish">Bearish</option>
                <option value="Highly Bearish">Highly Bearish</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGainersTab = () => {
    const topGainers = parsedReportData?.topGainers || [];
    const topLosers = parsedReportData?.topLosers || [];
    const volumeShockers = parsedReportData?.volumeShockers || [];
    const circuitStocks = parsedReportData?.circuitStocks || {};

    const renderStockTable = (title: string, path: string[], list: any[], isGainer: boolean) => (
      <div>
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">{title}</h4>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="p-3 border-b">Symbol</th>
                <th className="p-3 border-b">Company Name</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Change %</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {list.map((st: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-2 border-b">
                    <input
                      type="text"
                      value={st.symbol || ""}
                      onChange={(e) => updateNestedData([...path, idx, "symbol"], e.target.value)}
                      className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                      placeholder="INFY"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="text"
                      value={st.name || ""}
                      onChange={(e) => updateNestedData([...path, idx, "name"], e.target.value)}
                      className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                      placeholder="Infosys"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="number"
                      step="any"
                      value={st.price ?? ""}
                      onChange={(e) => updateNestedData([...path, idx, "price"], parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                      placeholder="1634.50"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="number"
                      step="any"
                      value={st.change ?? ""}
                      onChange={(e) => updateNestedData([...path, idx, "change"], parseFloat(e.target.value) || 0)}
                      className={`w-full p-1.5 border rounded-md text-sm font-semibold border-gray-200 ${
                        isGainer ? "text-green-600 bg-green-50/20" : "text-red-600 bg-red-50/20"
                      }`}
                      placeholder={isGainer ? "3.82" : "-2.34"}
                    />
                  </td>
                  <td className="p-2 border-b text-center">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(path, idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => addArrayItem(path, { symbol: "", name: "", price: 0, change: 0 })}
          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Stock
        </button>
      </div>
    );

    return (
      <div className="space-y-6">
        {renderStockTable("Top Gainers", ["topGainers"], topGainers, true)}
        <hr className="border-gray-100" />
        {renderStockTable("Top Losers", ["topLosers"], topLosers, false)}
        
        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Volume Shockers</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Symbol</th>
                  <th className="p-3 border-b">Company Name</th>
                  <th className="p-3 border-b">Volume Multiplier</th>
                  <th className="p-3 border-b">Remarks</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {volumeShockers.map((st: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={st.symbol || ""}
                        onChange={(e) => updateNestedData(["volumeShockers", idx, "symbol"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="ZOMATO"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={st.name || ""}
                        onChange={(e) => updateNestedData(["volumeShockers", idx, "name"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Zomato"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={st.volume || ""}
                        onChange={(e) => updateNestedData(["volumeShockers", idx, "volume"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="4.2x"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={st.remark || ""}
                        onChange={(e) => updateNestedData(["volumeShockers", idx, "remark"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Breakout candle on high delivery"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["volumeShockers"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["volumeShockers"], { symbol: "", name: "", volume: "", remark: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Volume Shocker
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Circuit Stocks</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Upper Circuit Stocks (Comma Separated)</label>
              <input
                type="text"
                value={(circuitStocks.upperCircuit || []).join(", ")}
                onChange={(e) => updateNestedData(["circuitStocks", "upperCircuit"], e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                className="w-full p-2 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="RAILTEL, RITES"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Lower Circuit Stocks (Comma Separated)</label>
              <input
                type="text"
                value={(circuitStocks.lowerCircuit || []).join(", ")}
                onChange={(e) => updateNestedData(["circuitStocks", "lowerCircuit"], e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                className="w-full p-2 border rounded-md text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="YESBANK, SUZLON"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFiiDiiTab = () => {
    const fii = parsedReportData?.fiidii?.fii || {};
    const dii = parsedReportData?.fiidii?.dii || {};
    const sectors = parsedReportData?.sectors || [];

    const renderFlowGroup = (label: string, type: "fii" | "dii", data: any) => (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">{label} flows</h5>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gross Buy (Cr)</label>
            <input
              type="number"
              step="any"
              value={data.buy ?? ""}
              onChange={(e) => handleFiiDiiChange(type, "buy", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="14823.42"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gross Sell (Cr)</label>
            <input
              type="number"
              step="any"
              value={data.sell ?? ""}
              onChange={(e) => handleFiiDiiChange(type, "sell", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="12104.67"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs bg-white p-2.5 rounded-md border border-gray-100">
          <div>
            <span className="text-gray-400 block">Net Flow (Cr)</span>
            <span className={`font-semibold text-sm ${data.net >= 0 ? "text-green-600" : "text-red-600"}`}>
              {data.net ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block">Activity Status</span>
            <span className={`font-semibold text-sm ${data.net >= 0 ? "text-green-600" : "text-red-600"}`}>
              {data.activity || "N/A"}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">FII / DII Activity</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {renderFlowGroup("Foreign Institutional Investors (FII)", "fii", fii)}
            {renderFlowGroup("Domestic Institutional Investors (DII)", "dii", dii)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">FII/DII Note</label>
              <textarea
                value={parsedReportData?.fiidii?.note || ""}
                onChange={(e) => updateNestedData(["fiidii", "note"], e.target.value)}
                className="w-full p-2 border rounded-md text-sm border-gray-200 focus:border-blue-500"
                rows={2}
                placeholder="FII turned net buyers for the 3rd consecutive session."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Derivatives Note</label>
              <textarea
                value={parsedReportData?.fiidii?.derivativesNote || ""}
                onChange={(e) => updateNestedData(["fiidii", "derivativesNote"], e.target.value)}
                className="w-full p-2 border rounded-md text-sm border-gray-200 focus:border-blue-500"
                rows={2}
                placeholder="FII net long in index futures."
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Sector Performance</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Sector</th>
                  <th className="p-3 border-b">Change %</th>
                  <th className="p-3 border-b">Direction</th>
                  <th className="p-3 border-b">Leader / Highlights</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sectors.map((sc: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={sc.name || ""}
                        onChange={(e) => updateNestedData(["sectors", idx, "name"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Nifty IT"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="number"
                        step="any"
                        value={sc.change ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          updateNestedData(["sectors", idx, "change"], val);
                          updateNestedData(["sectors", idx, "direction"], val >= 0 ? "up" : "down");
                        }}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="2.34"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <select
                        value={sc.direction || "up"}
                        onChange={(e) => updateNestedData(["sectors", idx, "direction"], e.target.value)}
                        className={`w-full p-1.5 border rounded-md text-sm border-gray-200 ${
                          sc.direction === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        }`}
                      >
                        <option value="up">Up 🟢</option>
                        <option value="down">Down 🔴</option>
                      </select>
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={sc.leader || ""}
                        onChange={(e) => updateNestedData(["sectors", idx, "leader"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="INFY (+3.8%)"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["sectors"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["sectors"], { name: "", change: 0, direction: "up", leader: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Sector
          </button>
        </div>
      </div>
    );
  };

  const renderFoTab = () => {
    const fo = parsedReportData?.fo || {};
    const nifty = fo.nifty || {};
    const bankNifty = fo.bankNifty || {};
    const oiActivity = fo.oiActivity || [];
    const activeOptions = fo.activeOptions || [];

    const renderIndexFoGroup = (title: string, indexName: "nifty" | "bankNifty", data: any) => (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">{title}</h5>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Spot Price</label>
            <input
              type="number"
              step="any"
              value={data.spot ?? ""}
              onChange={(e) => handleFoPriceChange(indexName, "spot", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="24521.35"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Futures Close</label>
            <input
              type="number"
              step="any"
              value={data.futuresClose ?? ""}
              onChange={(e) => handleFoPriceChange(indexName, "futuresClose", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="24538.10"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">PCR (Put Call Ratio)</label>
            <input
              type="number"
              step="any"
              value={data.pcr ?? ""}
              onChange={(e) => updateNestedData(["fo", indexName, "pcr"], parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="1.18"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Pain Strike</label>
            <input
              type="number"
              value={data.maxPain ?? ""}
              onChange={(e) => updateNestedData(["fo", indexName, "maxPain"], parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="24500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">IV Percentile</label>
            <input
              type="text"
              value={data.ivPercentile || ""}
              onChange={(e) => updateNestedData(["fo", indexName, "ivPercentile"], e.target.value)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="34th"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Basis (Fut - Spot)</label>
            <span className={`block font-semibold p-2 rounded bg-white border border-gray-100 text-sm ${data.basis >= 0 ? "text-green-600" : "text-red-600"}`}>
              {data.basis ?? 0}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Derivatives (F&O) Indices</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderIndexFoGroup("Nifty F&O Statistics", "nifty", nifty)}
            {renderIndexFoGroup("Bank Nifty F&O Statistics", "bankNifty", bankNifty)}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Open Interest (OI) Activity</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Strike</th>
                  <th className="p-3 border-b">OI Description</th>
                  <th className="p-3 border-b">Interpretation</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {oiActivity.map((oi: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={oi.strike || ""}
                        onChange={(e) => updateNestedData(["fo", "oiActivity", idx, "strike"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="24600 CE"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={oi.oi || ""}
                        onChange={(e) => updateNestedData(["fo", "oiActivity", idx, "oi"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="High Call OI"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={oi.interpretation || ""}
                        onChange={(e) => updateNestedData(["fo", "oiActivity", idx, "interpretation"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Strong resistance zone"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["fo", "oiActivity"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["fo", "oiActivity"], { strike: "", oi: "", interpretation: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add OI Row
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Most Active Options</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Option Instrument</th>
                  <th className="p-3 border-b">Volume</th>
                  <th className="p-3 border-b">Open Interest (OI)</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {activeOptions.map((opt: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={opt.instrument || ""}
                        onChange={(e) => updateNestedData(["fo", "activeOptions", idx, "instrument"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="NIFTY 24500 CE"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={opt.volume || ""}
                        onChange={(e) => updateNestedData(["fo", "activeOptions", idx, "volume"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="18.4L"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={opt.oi || ""}
                        onChange={(e) => updateNestedData(["fo", "activeOptions", idx, "oi"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="42.1L"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["fo", "activeOptions"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["fo", "activeOptions"], { instrument: "", volume: "", oi: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Active Option
          </button>
        </div>
      </div>
    );
  };

  const renderGlobalTab = () => {
    const globalData = parsedReportData?.global || {};
    const us = globalData.us || [];
    const asia = globalData.asia || [];
    const commodities = globalData.commodities || [];
    const corporateActions = parsedReportData?.corporateActions || [];
    const analystCalls = parsedReportData?.analystCalls || [];

    const renderGlobalList = (title: string, path: string[], list: any[]) => (
      <div>
        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{title}</h5>
        <div className="overflow-x-auto mb-2">
          <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="p-2 border-b text-xs">Index/Asset</th>
                <th className="p-2 border-b text-xs">Value</th>
                <th className="p-2 border-b text-xs">Change %</th>
                <th className="p-2 border-b text-xs">Dir</th>
                <th className="p-2 border-b text-xs text-center">x</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {list.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-1 border-b">
                    <input
                      type="text"
                      value={item.name || ""}
                      onChange={(e) => updateNestedData([...path, idx, "name"], e.target.value)}
                      className="w-full p-1 border rounded text-xs border-gray-200"
                      placeholder="Dow Jones"
                    />
                  </td>
                  <td className="p-1 border-b">
                    <input
                      type="text"
                      value={item.value || ""}
                      onChange={(e) => updateNestedData([...path, idx, "value"], e.target.value)}
                      className="w-full p-1 border rounded text-xs border-gray-200"
                      placeholder="42,841"
                    />
                  </td>
                  <td className="p-1 border-b">
                    <input
                      type="number"
                      step="any"
                      value={item.change ?? ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateNestedData([...path, idx, "change"], val);
                        updateNestedData([...path, idx, "direction"], val >= 0 ? "up" : "down");
                      }}
                      className="w-full p-1 border rounded text-xs border-gray-200"
                      placeholder="0.34"
                    />
                  </td>
                  <td className="p-1 border-b">
                    <select
                      value={item.direction || "up"}
                      onChange={(e) => updateNestedData([...path, idx, "direction"], e.target.value)}
                      className="p-1 border rounded text-xs border-gray-200"
                    >
                      <option value="up">🟢</option>
                      <option value="down">🔴</option>
                    </select>
                  </td>
                  <td className="p-1 border-b text-center">
                    <button
                      type="button"
                      onClick={() => removeArrayItem(path, idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => addArrayItem(path, { name: "", value: "", change: 0, direction: "up" })}
          className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-2 py-1 rounded font-medium transition-colors inline-flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Index
        </button>
      </div>
    );

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Global Markets</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {renderGlobalList("US Markets", ["global", "us"], us)}
            {renderGlobalList("Asian Markets", ["global", "asia"], asia)}
            {renderGlobalList("Commodities & Forex", ["global", "commodities"], commodities)}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Corporate Actions</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Event Type</th>
                  <th className="p-3 border-b">Company</th>
                  <th className="p-3 border-b">Detail / Result Summary</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {corporateActions.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.event || ""}
                        onChange={(e) => updateNestedData(["corporateActions", idx, "event"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Results / Dividend"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.company || ""}
                        onChange={(e) => updateNestedData(["corporateActions", idx, "company"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="TCS Q1FY27"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.detail || ""}
                        onChange={(e) => updateNestedData(["corporateActions", idx, "detail"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Revenue ₹63,437 Cr, up 4.4% YoY."
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["corporateActions"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["corporateActions"], { event: "", company: "", detail: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Corporate Action
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Analyst Calls</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Broker</th>
                  <th className="p-3 border-b">Stock</th>
                  <th className="p-3 border-b">Action Type</th>
                  <th className="p-3 border-b">Target Price</th>
                  <th className="p-3 border-b">Previous Rating</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {analystCalls.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.broker || ""}
                        onChange={(e) => updateNestedData(["analystCalls", idx, "broker"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Morgan Stanley"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.stock || ""}
                        onChange={(e) => updateNestedData(["analystCalls", idx, "stock"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="INFY"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.action || ""}
                        onChange={(e) => updateNestedData(["analystCalls", idx, "action"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Upgrade / Buy"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.target || ""}
                        onChange={(e) => updateNestedData(["analystCalls", idx, "target"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="₹1,820"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.prev || ""}
                        onChange={(e) => updateNestedData(["analystCalls", idx, "prev"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Neutral → Overweight"
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["analystCalls"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["analystCalls"], { broker: "", stock: "", action: "", target: "", prev: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Analyst Call
          </button>
        </div>
      </div>
    );
  };

  const renderTechnicalTab = () => {
    const technical = parsedReportData?.technical || {};
    const nifty = technical.nifty || {};
    const bankNifty = technical.bankNifty || {};
    const watchlist = technical.watchlist || [];

    const renderIndexTechGroup = (title: string, indexKey: "nifty" | "bankNifty", data: any) => (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">{title}</h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Technical Bias</label>
            <select
              value={data.bias || "Neutral"}
              onChange={(e) => updateNestedData(["technical", indexKey, "bias"], e.target.value)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
            >
              <option value="Bullish">Bullish</option>
              <option value="Neutral">Neutral</option>
              <option value="Bearish">Bearish</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Support Levels (Comma Separated)</label>
            <input
              type="text"
              value={(data.support || []).join(", ")}
              onChange={(e) => updateNestedData(["technical", indexKey, "support"], e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="24,400, 24,280, 24,150"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Resistance Levels (Comma Separated)</label>
            <input
              type="text"
              value={(data.resistance || []).join(", ")}
              onChange={(e) => updateNestedData(["technical", indexKey, "resistance"], e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              placeholder="24,600, 24,720, 24,880"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Candlestick Pattern / Trend Remarks</label>
            <textarea
              value={data.pattern || ""}
              onChange={(e) => updateNestedData(["technical", indexKey, "pattern"], e.target.value)}
              className="w-full p-2 border rounded-md text-sm border-gray-200 bg-white"
              rows={2}
              placeholder="Bullish engulfing candle formed on daily chart."
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderIndexTechGroup("Nifty Technicals", "nifty", nifty)}
          {renderIndexTechGroup("Bank Nifty Technicals", "bankNifty", bankNifty)}
        </div>

        <hr className="border-gray-100" />

        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Technical Watchlist</h4>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Symbol</th>
                  <th className="p-3 border-b">Technical Setup & Rationale</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {watchlist.map((st: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b w-1/4">
                      <input
                        type="text"
                        value={st.symbol || ""}
                        onChange={(e) => updateNestedData(["technical", "watchlist", idx, "symbol"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="INFY"
                      />
                    </td>
                    <td className="p-2 border-b w-3/4">
                      <input
                        type="text"
                        value={st.setup || ""}
                        onChange={(e) => updateNestedData(["technical", "watchlist", idx, "setup"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Breakout above ₹1,640 with volume. Target ₹1,700."
                      />
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["technical", "watchlist"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["technical", "watchlist"], { symbol: "", setup: "" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Watchlist Stock
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Overall Technical Conclusion</label>
          <textarea
            value={technical.conclusion || ""}
            onChange={(e) => updateNestedData(["technical", "conclusion"], e.target.value)}
            className="w-full p-2.5 border rounded-md text-sm border-gray-200 focus:border-blue-500"
            rows={3}
            placeholder="The broader trend remains positive."
          />
        </div>
      </div>
    );
  };

  const renderSnapshotTab = () => {
    const quickSnapshot = parsedReportData?.quickSnapshot || [];

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Quick Snapshot Metrics</h4>
          <p className="text-xs text-gray-500 mb-4">These display at the top of the report page as highlighted metric badges.</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="p-3 border-b">Metric Label</th>
                  <th className="p-3 border-b">Value</th>
                  <th className="p-3 border-b">Text Color Class</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {quickSnapshot.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) => updateNestedData(["quickSnapshot", idx, "label"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Market Bias"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        value={item.value || ""}
                        onChange={(e) => updateNestedData(["quickSnapshot", idx, "value"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                        placeholder="Bullish"
                      />
                    </td>
                    <td className="p-2 border-b">
                      <select
                        value={item.color || "text-green-600"}
                        onChange={(e) => updateNestedData(["quickSnapshot", idx, "color"], e.target.value)}
                        className="w-full p-1.5 border rounded-md text-sm border-gray-200"
                      >
                        <option value="text-green-600">Green (text-green-600)</option>
                        <option value="text-red-600">Red (text-red-600)</option>
                        <option value="text-yellow-600">Yellow (text-yellow-600)</option>
                        <option value="text-blue-600">Blue (text-blue-600)</option>
                        <option value="text-gray-600">Gray (text-gray-600)</option>
                      </select>
                    </td>
                    <td className="p-2 border-b text-center">
                      <button
                        type="button"
                        onClick={() => removeArrayItem(["quickSnapshot"], idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addArrayItem(["quickSnapshot"], { label: "", value: "", color: "text-green-600" })}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Metric Card
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Post-Market Reports</h1>
          <p className="text-gray-500 mt-1">Manage daily post-market insights</p>
        </div>
        <button
          onClick={() => {
            if (formOpen) {
              setFormOpen(false);
              setEditingSlug(null);
            } else {
              handleAddNew();
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          {formOpen ? "Cancel" : "Add New Report"}
        </button>
      </header>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{editingSlug ? "Edit Post-Market Report" : "Create Post-Market Report"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={generateSlug}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                required
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Report Date</label>
              <input
                required
                type="date"
                name="report_date"
                value={formData.report_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <label className="text-sm font-medium">Published</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Analyst</label>
              <input
                type="text"
                name="analyst"
                value={formData.analyst}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Analyst Designation</label>
              <input
                type="text"
                name="analyst_designation"
                value={formData.analyst_designation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Overall Conclusion</label>
            <textarea
              name="overall_conclusion"
              value={formData.overall_conclusion}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Custom SEO Title"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border rounded"
                  placeholder="Short summary for search engines"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Comma separated keywords"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Report Details Data</h3>
                <p className="text-xs text-gray-500">Configure report indices, options, sectors and market trends</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("form")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    editMode === "form"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FormInput className="w-3.5 h-3.5" />
                  Form Editor
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("json")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    editMode === "json"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  JSON Editor
                </button>
              </div>
            </div>

            {editMode === "form" ? (
              <div className="flex flex-col md:flex-row gap-6 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                {/* Tab List */}
                <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-4">
                  {formTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFormTab(tab.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap md:whitespace-normal ${
                        activeFormTab === tab.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Tab Panel */}
                <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-w-0">
                  {activeFormTab === "summary" && renderSummaryTab()}
                  {activeFormTab === "gainers" && renderGainersTab()}
                  {activeFormTab === "fiidii" && renderFiiDiiTab()}
                  {activeFormTab === "fo" && renderFoTab()}
                  {activeFormTab === "global" && renderGlobalTab()}
                  {activeFormTab === "technical" && renderTechnicalTab()}
                  {activeFormTab === "snapshot" && renderSnapshotTab()}
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Paste or edit the complete raw JSON structure below. Modifying it will sync back to the visual form.</p>
                <textarea
                  required
                  name="report_data"
                  value={formData.report_data}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full p-3 border rounded-lg font-mono text-xs bg-gray-900 text-green-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder='{"marketSummary": {...}, "topGainers": [...]}'
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditingSlug(null);
              }}
              className="px-4 py-2 border rounded font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Saving..." : "Save Report"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500 py-10 text-center">Loading reports...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(r.report_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 block">{r.title}</span>
                      <div className="text-xs text-gray-500 mt-1">{r.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.is_published ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium border border-green-200">Published</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.slug)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
