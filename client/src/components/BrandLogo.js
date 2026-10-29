const sizeClass = {
  nav: 'h-14 sm:h-16 md:h-[4.5rem] w-auto',
  footer: 'h-20 sm:h-24 md:h-28 w-auto',
  intro: 'h-40 sm:h-48 md:h-56 lg:h-64 w-auto max-w-[min(86vw,32rem)]',
  login: 'h-20 w-auto mx-auto',
};

const BrandLogo = ({ size = 'nav', className = '', priority = false }) => (
  <img
    src="/logo.png"
    alt="Vastu Soundarya Architects & Interiors"
    className={`${sizeClass[size] || sizeClass.nav} object-contain object-center ${className}`}
    decoding="async"
    fetchPriority={priority ? 'high' : 'auto'}
  />
);

export default BrandLogo;
