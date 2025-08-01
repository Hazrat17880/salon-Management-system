'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-pink-50 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/hero-pattern.svg')] bg-[length:1200px] bg-center opacity-10"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 max-w-2xl">
          <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
            Salon Management Reinvented
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600">Salon Business</span> with Smart Technology
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            Streamline appointments, manage staff, and grow your clientele with our all-in-one salon management platform designed for modern beauty professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
            <Link href="/booking">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                Get Started Free
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
            <Link href="/services/hair">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-gray-700 font-medium bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-300">
                Explore Features
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 2.759 1.38a1 1 0 001.075-1.823l-10-4z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No installation required</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/dashboard.png"
              alt="SalonPro Dashboard Preview"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-2xl -z-10"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-2xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}