import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page Not Found | VastuSoundarya Architects & Interiors';
  }, []);

  return (
    <section className="min-h-[70vh] flex items-center justify-center section-padding">
      <div className="text-center">
        <h1 className="font-display text-8xl text-gold-600 mb-4">404</h1>
        <h2 className="font-display text-2xl text-charcoal-900 mb-4">Page Not Found</h2>
        <p className="text-charcoal-500 mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </section>
  );
};

export default NotFound;
