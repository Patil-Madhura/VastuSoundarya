import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { contactInfo, SITE_NAME } from '../data/contactInfo';

const MailIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-charcoal-800">
          {/* Company Brand & Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block" aria-label={`${SITE_NAME} home`}>
              <BrandLogo size="nav" className="h-10 sm:h-12 w-auto" />
            </Link>
            <span className="font-display text-base sm:text-lg text-white tracking-wide">
              {SITE_NAME}
            </span>
          </div>

          {/* Contact Email & Social Media Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 text-sm text-charcoal-300 hover:text-gold-400 transition-colors duration-200"
              aria-label={`Email ${contactInfo.email}`}
            >
              <MailIcon className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{contactInfo.email}</span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href={contactInfo.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-800 flex items-center justify-center text-charcoal-300 hover:text-white hover:bg-gold-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href={contactInfo.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-800 flex items-center justify-center text-charcoal-300 hover:text-white hover:bg-gold-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Small Copyright Section */}
        <div className="pt-6 text-center text-xs sm:text-sm text-charcoal-400">
          &copy; 2026 VastuSoundarya Architects &amp; Interiors. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
