// app/bookings/confirmation/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, Scissors } from "lucide-react";
import Link from "next/link";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAppointment = async () => {
      try {
        const res = await fetch(`/api/user/appointments/${appointmentId}`);
        const data = await res.json();
        if (data.success) {
          setAppointment(data.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Your appointment has been successfully booked and paid for.
        </p>

        {appointment && (
          <div className="bg-indigo-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4">Appointment Details</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-indigo-600" />
                <span>{appointment.service_name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>{appointment.time}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="font-semibold">
                Total Paid: ${(appointment.amount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            href="/user/dashboard"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/user/appointments"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition"
          >
            View All Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}