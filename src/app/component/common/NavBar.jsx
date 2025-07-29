'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Salons', href: '/salons' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          SalonFinder
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-pink-600 transition font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-pink-600 text-pink-600 rounded hover:bg-pink-50 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          >
            Register
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-pink-600 transition"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-pink-600 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-pink-600 transition"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
