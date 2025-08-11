'use client';

import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Great for getting started with basic features',
    features: [
      'Up to 10 staff members',
      '50 appointments/per day',
      'Essential features',
      'Community support',
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$5',
    period: 'per month',
    description: 'Perfect for individual stylists or small salons',
    features: [
      'Up to 30 staff members',
      '200 appointments/ per day',
      'Basic reporting',
      'Email support',
    ],
    cta: 'Upgrade Now',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$25',
    period: 'per month',
    description: 'Ideal for growing salons with multiple staff',
    features: [
      'Up to 50 staff members',
      'Unlimited appointments',
      'Advanced reporting',
      'Priority support',
      'Marketing tools',
    ],
    cta: 'Upgrade Now',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large salon chains and franchises',
    features: [
      'Unlimited staff',
      'Unlimited appointments',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];


export default function PricingSection() {
  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent <span className="text-pink-600">Pricing</span>
          </h2>
         <p className="text-lg text-gray-600">
  Choose a plan that grows with your salon. Start for free, upgrade anytime.
</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-xl shadow-md overflow-hidden border ${
                plan.popular 
                  ? 'border-pink-500 transform md:-translate-y-4' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-pink-600 text-white text-center py-1 text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-8 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1 mb-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-medium hover:bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:text-white ${
                    plan.popular
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          Need help choosing? <Link href="/contact" className="text-pink-600 hover:underline">Contact our team</Link>
        </div>
      </div>
    </section>
  );
}