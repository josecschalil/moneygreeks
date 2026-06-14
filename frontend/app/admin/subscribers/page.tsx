"use client";

import { useEffect, useState } from "react";
import { Trash2, Users } from "lucide-react";

export default function SubscribersAdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter-subscribe/`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter-subscribe/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSubscribers();
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Newsletter Subscribers
          </h1>
          <p className="text-gray-500 mt-2">Manage your email newsletter list</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          Total: {subscribers.length}
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No subscribers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/4">Date Subscribed</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/2">Email Address</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr 
                    key={sub.id} 
                    className="bg-white hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(sub.subscribed_at).toLocaleDateString()} at {new Date(sub.subscribed_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{sub.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => deleteSubscriber(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
