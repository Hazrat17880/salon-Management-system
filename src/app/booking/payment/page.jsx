// app/bookings/payment/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (!appointmentId) return;

    // Get payment intent for this appointment
    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch('/api/bookings/get-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId })
        });

        const data = await res.json();
        
        if (data.success) {
          setClientSecret(data.clientSecret);
          setAppointment(data.appointment);
        } else {
          toast.error('Failed to load payment details');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading payment');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-xl">
        <h2 className="text-red-600 text-xl font-bold mb-2">Error</h2>
        <p className="text-gray-700">Could not load payment information</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      
      {appointment && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="font-semibold">Appointment Details:</p>
          <p>Service: {appointment.service_name}</p>
          <p className="text-lg font-bold text-indigo-600 mt-2">
            Total: ${(appointment.amount / 100).toFixed(2)}
          </p>
        </div>
      )}

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm appointmentId={appointmentId} />
      </Elements>
    </div>
  );
}

function PaymentForm({ appointmentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings/confirmation?appointmentId=${appointmentId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Update appointment status
      await fetch('/api/bookings/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appointmentId,
          paymentIntentId: paymentIntent.id 
        })
      });

      toast.success('Payment successful!');
      router.push(`/bookings/confirmation?appointmentId=${appointmentId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}