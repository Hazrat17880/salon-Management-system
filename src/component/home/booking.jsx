// components/BookingSteps.jsx
export default function BookingSteps() {
  const steps = [
    { number: 1, title: 'Choose Service', description: 'Pick a salon and service from our directory.' },
    { number: 2, title: 'Book Slot', description: 'Select your preferred time and date.' },
    { number: 3, title: 'Get Styled', description: 'Visit the salon and enjoy the service!' },
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <div className="text-pink-500 text-4xl font-bold mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
