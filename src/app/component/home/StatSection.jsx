'use client';

const stats = [
  { value: '10,000+', label: 'Salons Worldwide' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Support Available' },
  { value: '5M+', label: 'Appointments Monthly' },
];

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-pink-600 to-fuchsia-600 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm md:text-base font-medium text-pink-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}