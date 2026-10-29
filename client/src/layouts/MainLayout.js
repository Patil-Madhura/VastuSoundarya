import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingIntro from '../components/LandingIntro';
import { SITE_NAME } from '../data/contactInfo';

const SITE_TITLE = SITE_NAME;

const pageTitles = {
  '/': SITE_TITLE,
  '/about': `About | ${SITE_TITLE}`,
  '/services': `Services | ${SITE_TITLE}`,
  '/projects': `Projects | ${SITE_TITLE}`,
  '/appointment': `Book Appointment | ${SITE_TITLE}`,
  '/contact': `Contact | ${SITE_TITLE}`,
};

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = Object.keys(pageTitles).find(
      (path) => path !== '/' && pathname.startsWith(path)
    );
    document.title = pageTitles[pathname] || pageTitles[key] || SITE_TITLE;
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingIntro />
      <Navbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
