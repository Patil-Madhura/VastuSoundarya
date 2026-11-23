import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingIntro from '../components/LandingIntro';
import { SITE_NAME, SITE_FULL_TITLE } from '../data/contactInfo';

const pageTitles = {
  '/': SITE_FULL_TITLE,
  '/about': `About Us | ${SITE_NAME}`,
  '/services': `Our Services | ${SITE_NAME}`,
  '/projects': `Projects | ${SITE_NAME}`,
  '/appointment': `Book Appointment | ${SITE_NAME}`,
  '/contact': `Contact Us | ${SITE_NAME}`,
};

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = Object.keys(pageTitles).find(
      (path) => path !== '/' && pathname.startsWith(path)
    );
    document.title = pageTitles[pathname] || pageTitles[key] || SITE_FULL_TITLE;
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
