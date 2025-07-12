'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse', href: '/items' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Admin', href: '/admin' },
    { name: 'Login', href: '/login' }
  ];

  return (
    <nav 
      className="flex items-center justify-between p-4 shadow sticky top-0 z-50"
      style={{ 
        background: "var(--surface)", 
        color: "var(--foreground)" 
      }}
    >
      {/* Logo */}
      <Link 
        href="/" 
        className="font-bold text-xl hover:opacity-90 transition-opacity"
        style={{ 
          color: "var(--foreground)", 
          opacity: 0.9 
        }}
      >
        ReWear
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`hover:underline transition-all ${
                pathname === link.href ? 'opacity-100 font-medium' : 'opacity-70'
              }`}
              style={{ color: "var(--foreground)" }}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-1"
        aria-label="Toggle menu"
        style={{ color: "var(--foreground)", opacity: 0.7 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </nav>
  );
}