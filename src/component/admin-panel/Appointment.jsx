'use client';

import React, { useEffect, useState } from 'react';

const AppointmentsPage = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    accepted: 0,
    rejected: 0,
  });

  // ✅ Normalize status
  const normalizeStatus = (apt) => {
    if (apt.appointment_status === 'accept') return 'accepted';
    if (apt.appointment_status === 'completed') return 'completed';
    if (apt.appointment_status === 'pending') return 'pending';
    if (apt.appointment_status === '') return 'pending'; // Empty string also means pending
    return 'pending';
  };

  // ✅ Fetch data
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/admin/appointments');

      if (!res.ok) {
        console.error("❌ API ERROR:", res.status);
        return;
      }

      const response = await res.json();

      console.log("🔥 FULL DATA:", response);

      // ✅ FIX: Access appointments from data.appointments
      const appointments = response?.data?.appointments || [];

      console.log("✅ APPOINTMENTS:", appointments);
      console.log("✅ APPOINTMENTS COUNT:", appointments.length);

      // =========================
      // ✅ STATS CALCULATION
      // =========================
      let total = appointments.length;
      let pending = 0;
      let completed = 0;
      let accepted = 0;
      let rejected = 0;

      appointments.forEach((apt) => {
        let status = apt.appointment_status;

        if (status === "accept") accepted++;
        else if (status === "completed") completed++;
        else if (status === "pending") pending++;
        else pending++; // empty "" goes here
      });

      setStats({
        total,
        pending,
        completed,
        accepted,
        rejected,
      });

      // =========================
      // ✅ GROUP BY SALON
      // =========================
      const salonMap = {};

      appointments.forEach((apt) => {
        if (!salonMap[apt.salon_id]) {
          salonMap[apt.salon_id] = {
            salon_id: apt.salon_id,
            salon_name: apt.salon_name,
            appointments: [],
          };
        }

        // Add normalized status to each appointment
        salonMap[apt.salon_id].appointments.push({
          ...apt,
          status: normalizeStatus(apt),
        });
      });

      const groupedSalons = Object.values(salonMap);

      console.log("🏢 GROUPED SALONS:", groupedSalons);

      setSalons(groupedSalons);
      
      // Set pagination info if needed
      if (response?.data?.pagination) {
        setPagination(response.data.pagination);
      }

    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-gray-500">Manage appointments by salon</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Accepted" value={stats.accepted} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>

      {/* Salon List */}
      {salons.length > 0 ? (
        <div className="space-y-4">
          {salons.map((salon) => (
            <div key={salon.salon_id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="font-semibold text-xl mb-4 text-gray-800 border-b pb-2">
                {salon.salon_name}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({salon.appointments.length} appointment{salon.appointments.length !== 1 ? 's' : ''})
                </span>
              </h2>

              <div className="space-y-3">
                {salon.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="border-b border-gray-100 py-3 flex justify-between items-start hover:bg-gray-50 px-2 rounded transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">{apt.user_name}</p>
                        <span className="text-xs text-gray-400">ID: {apt.id}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Service:</span> {apt.service_title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          📅 {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>⏰ {apt.appointment_time.substring(0, 5)}</span>
                        {apt.amount && (
                          <span>💰 ${(apt.amount / 100).toFixed(2)}</span>
                        )}
                      </div>
                      {apt.user_phone && (
                        <p className="text-xs text-gray-400 mt-1">📞 {apt.user_phone}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          apt.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : apt.status === 'accepted'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {apt.status === 'accepted' ? 'Accepted' : 
                         apt.status === 'completed' ? 'Completed' : 
                         apt.status === 'pending' ? 'Pending' : apt.status}
                      </span>
                      {apt.payment_status && (
                        <span className={`text-xs ${
                          apt.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {apt.payment_status === 'paid' ? '✓ Paid' : 'Payment Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 py-12 bg-gray-50 rounded-lg">
          <p className="text-lg">No appointments found</p>
          <p className="text-sm mt-2">No salons with appointments to display</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex justify-between items-center text-sm text-gray-400 pt-4 border-t">
        <p>Showing {salons.length} salon{salons.length !== 1 ? 's' : ''} with appointments</p>
        {pagination && (
          <p>Page {pagination.page} of {pagination.totalPages} • Total: {pagination.total} appointments</p>
        )}
      </div>
    </div>
  );
};

// ✅ Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition">
    <p className="text-gray-500 text-sm uppercase tracking-wide">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default AppointmentsPage;