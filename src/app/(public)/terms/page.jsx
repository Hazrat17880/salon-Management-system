// pages/terms-of-service.js
import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Terms of Service | Salon Management System</title>
        <meta name="description" content="Terms and conditions for using our salon management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header - Same as Privacy Policy */}
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
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <p className="text-gray-700 mb-6">
              Welcome to SalonPro! These Terms of Service govern your use of our salon management system and related services. By accessing or using our services, you agree to be bound by these terms.
            </p>

            <Section title="1. Acceptance of Terms">
              <p className="text-gray-700">
                By accessing or using the SalonPro platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </Section>

            <Section title="2. Account Registration">
              <p className="text-gray-700 mb-4">To access certain features of our services, you must register for an account. When registering, you agree to:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                <li>Promptly update any information to keep it accurate, current, and complete</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </Section>

            <Section title="3. Subscription and Payments">
              <p className="text-gray-700 mb-4">Certain aspects of our service may be provided for a fee. By selecting a premium service, you agree to pay the specified fees.</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Fees are non-refundable except as required by law or as otherwise stated</li>
                <li>We may change our fees at any time by providing notice</li>
                <li>Your subscription will automatically renew until canceled</li>
                <li>You may cancel your subscription at any time through your account settings</li>
              </ul>
            </Section>

            <Section title="4. User Conduct">
              <p className="text-gray-700 mb-4">You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Copying, distributing, or disclosing any part of the service in any medium</li>
                <li>Using any automated system to access the service in a manner that sends more request messages than a human could reasonably produce</li>
                <li>Compromising the security of the service</li>
                <li>Interfering with the proper working of the service</li>
                <li>Accessing any content on the service through any technology or means other than those provided by us</li>
                <li>Bypassing the measures we may use to prevent or restrict access to the service</li>
              </ul>
            </Section>

            <Section title="5. Intellectual Property">
              <p className="text-gray-700">
                The SalonPro platform and its original content, features, and functionality are owned by SalonPro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements without express written permission.
              </p>
            </Section>

            <Section title="6. Termination">
              <p className="text-gray-700">
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p className="text-gray-700">
                In no event shall SalonPro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
              </p>
            </Section>

            <Section title="8. Disclaimer">
              <p className="text-gray-700">
                Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>
            </Section>

            <Section title="9. Governing Law">
              <p className="text-gray-700">
                These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </Section>

            <Section title="10. Changes to Terms">
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </Section>

            <Section title="11. Contact Information">
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: legal@salonpro.com<br />
                Address: 123 Beauty Street, Salon City, SC 12345
              </p>
            </Section>
          </div>
        </div>
      </main>

      {/* Footer - Same as Privacy Policy */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SalonPro</h3>
              <p className="text-gray-400">The complete salon management solution for modern beauty businesses.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4-902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SalonPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
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