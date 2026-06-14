"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";

export default function EnquiriesAdminPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !currentStatus }),
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteEnquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Enquiries
        </h1>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Subject</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Message</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enq) => (
                  <tr 
                    key={enq.id} 
                    className={`transition-colors ${enq.is_read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{enq.first_name} {enq.last_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {enq.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {enq.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {enq.message}
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          enq.is_read 
                            ? "bg-gray-100 text-gray-600" 
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {enq.is_read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => markAsRead(enq.id, enq.is_read)}
                          className={`p-2 transition-colors ${enq.is_read ? 'text-gray-400 hover:text-blue-600' : 'text-blue-600 hover:text-blue-800'}`}
                          title={enq.is_read ? "Mark as unread" : "Mark as read"}
                        >
                          {enq.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                        </button>
                        <button 
                          onClick={() => deleteEnquiry(enq.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
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
