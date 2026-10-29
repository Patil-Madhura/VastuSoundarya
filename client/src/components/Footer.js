import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="inline-block mb-4" aria-label="Vastu Soundarya Architects & Interiors home">
              <BrandLogo size="footer" />
            </Link>
            <p className="text-charcoal-300 leading-relaxed">
              Vastu Soundarya Architects &amp; Interiors
            </p>
            <p className="text-charcoal-300 leading-relaxed mt-3">
              Transforming ideas into beautiful, functional, and harmonious spaces through modern
              architecture, luxury interiors, and traditional Vastu principles.
            </p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wider text-sm mb-4 text-gold-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-charcoal-300">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Services</Link></li>
              <li><Link to="/projects" className="hover:text-gold-400 transition-colors">Projects</Link></li>
              <li><Link to="/appointment" className="hover:text-gold-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wider text-sm mb-4 text-gold-400">
              Contact
            </h4>
            <ul className="space-y-3 text-charcoal-300">
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400/80 mb-1">
                  Contact No.
                </span>
                <a href="tel:+918263992174" className="hover:text-gold-400 transition-colors">
                  +91 82639 92174
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400/80 mb-1">
                  Email
                </span>
                <a href="mailto:vastusoundaryarch@gmail.com" className="hover:text-gold-400 transition-colors break-all">
                  vastusoundaryarch@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400/80 mb-1">
                  Address
                </span>
                Sangli, Maharashtra
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400/80 mb-1">
                  LinkedIn
                </span>
                <a
                  href="https://www.linkedin.com/in/avishkar-shinde-7400b23a8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors break-all"
                >
                  linkedin.com/in/avishkar-shinde-7400b23a8
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-700 mt-12 pt-8 text-center text-charcoal-400 text-sm">
          &copy; {new Date().getFullYear()} Vastu Soundarya Architects &amp; Interiors. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
