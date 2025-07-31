'use client';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Sign Up',
      desc: 'Register as a customer, salon staff, or admin with a few easy steps.',
    },
    {
      title: 'Verify Account',
      desc: 'Verify your email or phone number for secure access and personalized features.',
    },
    {
      title: 'Login to Dashboard',
      desc: 'Access your custom dashboard to manage appointments, profile, and more.',
    },
    {
      title: 'Book & Manage Appointments',
      desc: 'Easily book, reschedule, or cancel appointments with real-time availability.',
    },
    {
      title: 'Track History & Services',
      desc: 'Keep track of past visits, reviews, and salon service history seamlessly.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Steps Column */}
        <div>
          <h2 className="text-4xl font-bold text-pink-600 mb-8">How It Works</h2>
          <ul className="space-y-8">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="text-pink-500 text-xl font-bold">{index + 1}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Image Column */}
        <div className="relative">
          <img
            src="./howitswork.jpg"
            alt="How It Works"
            className="rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fade-in"
          />
          {/* Optional glow or gradient */}
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-pink-400 opacity-30 blur-3xl rounded-full z-0 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
