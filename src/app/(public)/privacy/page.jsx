// pages/privacy-policy.js
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Privacy Policy | Salon Management System</title>
        <meta name="description" content="Our commitment to protecting your personal information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SalonPro
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-indigo-200 transition-colors">
              Home
            </Link>
            <Link href="/features" className="hover:text-indigo-200 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-indigo-200 transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-indigo-200 transition-colors">
              Contact
            </Link>
          </nav>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <p className="text-gray-700 mb-6">
              At SalonPro, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our salon management system.
            </p>

            <Section title="1. Information We Collect">
              <p className="text-gray-700 mb-4">We collect information you provide directly to us, such as when you create an account, book an appointment, or contact us for support. This may include:</p>
              <ul className="list-disc pl-5 text-gray-700 mb-4 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Appointment history and preferences</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <p className="text-gray-700">We also automatically collect certain information about your device and usage of our services through cookies and similar technologies.</p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </Section>

            <Section title="3. Information Sharing">
              <p className="text-gray-700">
                We do not sell your personal information to third parties. We may share your information with service providers who assist us in operating our platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </Section>

            <Section title="4. Data Security">
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </Section>

            <Section title="5. Your Rights">
              <p className="text-gray-700 mb-4">Depending on your location, you may have certain rights regarding your personal information, such as:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>The right to access and receive a copy of your personal information</li>
                <li>The right to rectify inaccurate or incomplete information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to restrict or object to our processing of your information</li>
                <li>The right to data portability</li>
              </ul>
            </Section>

            <Section title="6. Changes to This Policy">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective.
              </p>
            </Section>

            <Section title="7. Contact Us">
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: privacy@salonpro.com<br />
                Address: 123 Beauty Street, Salon City, SC 12345
              </p>
            </Section>
          </div>
        </div>
      </main>

  
    </div>
  );
}

// Reusable section component
function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </section>
  );
}