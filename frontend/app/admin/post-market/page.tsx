"use client";

import { useEffect, useState } from "react";

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

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    report_date: new Date().toISOString().split("T")[0],
    analyst: "Jose C S",
    analyst_designation: "Founder & Head Analyst, MoneyGreeks",
    overall_conclusion: "",
    report_data: JSON_TEMPLATE,
    is_published: true,
  });

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/post-market-list/");
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Validate JSON
      let parsedData = {};
      try {
        parsedData = JSON.parse(formData.report_data);
      } catch (jsonErr) {
        alert("Invalid JSON format in Report Data field.");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        report_data: parsedData,
      };

      const res = await fetch("http://127.0.0.1:8000/post-market-list/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Report added successfully!");
        setFormOpen(false);
        setFormData({
          title: "",
          slug: "",
          report_date: "",
          analyst: "Jose C S",
          analyst_designation: "Founder & Head Analyst, MoneyGreeks",
          overall_conclusion: "",
          report_data: "",
          is_published: true,
        });
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

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/post-market-list/${slug}/`, {
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Post-Market Reports</h1>
          <p className="text-gray-500 mt-1">Manage daily post-market insights</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          {formOpen ? "Cancel" : "Add New Report"}
        </button>
      </header>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Create Post-Market Report</h2>
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Report Data (JSON Format)</label>
            <p className="text-xs text-gray-500 mb-2">Paste the complete JSON structure here.</p>
            <textarea
              required
              name="report_data"
              value={formData.report_data}
              onChange={handleInputChange}
              rows={15}
              className="w-full p-2 border rounded font-mono text-sm"
              placeholder='{"marketSummary": {...}, "topGainers": [...]}'
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Report"}
          </button>
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
