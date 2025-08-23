"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Eye, X, Check, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

export default function ComplaintsManager() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editText, setEditText] = useState("");
  const [editType, setEditType] = useState("salon");
  const [viewComplaint, setViewComplaint] = useState(null);
  const [deleteComplaintId, setDeleteComplaintId] = useState(null);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/complaints/user");
      const data = await res.json();
      setComplaints(data.data);
    } catch (error) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Delete complaint
  const confirmDelete = async () => {
    try {
      await fetch(`/api/complaints/user/?id=${deleteComplaintId}`, { method: "DELETE" });
      toast.success("Complaint deleted");
      setDeleteComplaintId(null);
      fetchComplaints();
    } catch {
      toast.error("Error deleting complaint");
    }
  };

  // Update complaint
  const updateComplaint = async () => {
    if (!editText.trim()) {
      toast.error("Complaint text cannot be empty");
      return;
    }
    try {
      await fetch(`/api/complaints/user/?id=${editingComplaint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_about: editType,
          description: editText,
        }),
      });
      toast.success("Complaint updated successfully");
      setEditingComplaint(null);
      fetchComplaints();
    } catch {
      toast.error("Error updating complaint");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Complaints Management</h2>

      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div className="grid gap-4">
          {complaints?.map((c) => (
            <motion.div
              key={c.id}
              className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
              whileHover={{ scale: 1.01 }}
            >
              <div>
                <p className="text-sm text-gray-500">{c.complaint_about.toUpperCase()}</p>
                <p className="font-medium">{c.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted on {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewComplaint(c)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => {
                    setEditingComplaint(c);
                    setEditText(c.description);
                    setEditType(c.complaint_about);
                  }}
                  className="text-green-500 hover:text-green-700"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => setDeleteComplaintId(c.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Complaint Modal */}
      {viewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button
              onClick={() => setViewComplaint(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>
            <h3 className="text-lg font-bold mb-4">Complaint Details</h3>
            <p>
              <span className="font-semibold">Type:</span> {viewComplaint.complaint_about}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Description:</span> {viewComplaint.description}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Submitted: {new Date(viewComplaint.created_at).toLocaleString()}
            </p>
          </motion.div>
        </div>
      )}

      {/* Edit Complaint Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={() => setEditingComplaint(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Complaint</h3>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="salon">Salon</option>
              <option value="services">Services</option>
            </select>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border rounded-lg p-3 h-32 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={updateComplaint}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Check size={20} /> Save
              </button>
              <button
                onClick={() => setEditingComplaint(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteComplaintId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              onClick={() => setDeleteComplaintId(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
            <h3 className="text-lg font-bold mb-2">Delete Complaint?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to permanently
              delete this complaint?
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteComplaintId(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
