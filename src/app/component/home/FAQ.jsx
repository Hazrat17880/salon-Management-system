'use client';
import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is the platform really free to use?',
    answer: 'Yes! Our Free Plan is completely free to start with no credit card required. You get access to essential features to manage your salon efficiently without any time limit.',
  },
  {
    question: 'What features are included in the Free Plan?',
    answer: 'The Free Plan includes core features like appointment scheduling, staff management, and basic reporting — perfect for startups and small salons.',
  },
  {
    question: 'Can I upgrade later if my salon grows?',
    answer: 'Absolutely! You can upgrade to our premium plans anytime to unlock advanced features like marketing tools, priority support, and more staff capacity.',
  },
  {
    question: 'Is there a contract or long-term commitment?',
    answer: 'No. Our service is month-to-month. You can cancel, upgrade, or downgrade your plan anytime — no strings attached.',
  },
  {
    question: 'How secure is my salon and client data?',
    answer: 'We use 256-bit SSL encryption for all data, and our servers are hosted on secure, SOC 2-compliant infrastructure with regular backups.',
  },
  {
    question: 'Can I use this platform on different devices?',
    answer: 'Yes, our web app works on any modern browser, and mobile access is supported across iOS and Android devices.',
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <article className="container my-genel py-20 bg-white" id="faq">
      <h2 className="text-center my-inner text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Frequently Asked <span className="text-pink-600">Questions</span>
      </h2>
      <p className="text-center text-lg text-gray-600 mb-16">
        Can't find what you're looking for? <Link href="/contact" className="text-pink-600 hover:underline">Contact our support team</Link>.
      </p>

      <div className="max-w-4xl md:mx-auto px-4 ">
        {faqs.map((faq, index) => (
          <section key={index} className="question mb-4 border-b border-gray-200 pb-4">
            {/* question title */}
            <div className="question-title flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900 hover:text-pink-500 cursor-pointer">{faq.question}</p>
              <button 
                type="button" 
                className="question-btn focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`plus-icon ${activeIndex === index ? 'hidden' : 'block'}`}>
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <span className={`minus-icon ${activeIndex === index ? 'block' : 'hidden'}`}>
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </span>
              </button>
            </div>
            {/* question text */}
            <div className={`question-text ${activeIndex === index ? 'block' : 'hidden'} pt-2`}>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}