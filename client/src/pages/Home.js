import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjects, getServices } from '../services/apiService';
import ProjectCard from '../components/ProjectCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CountUp from '../components/CountUp';

const testimonials = [
  {
    name: 'Rajesh & Priya Sharma',
    role: 'Homeowners, Pune',
    text: 'VastuSoundarya transformed our villa into a masterpiece. The blend of modern design with Vastu principles exceeded our expectations.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    name: 'Anita Desai',
    role: 'Business Owner, Mumbai',
    text: 'Our office redesign improved both aesthetics and team productivity. Professional, creative, and truly understanding of our vision.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    name: 'Vikram Patel',
    role: 'Developer, Bangalore',
    text: 'From planning to execution, their attention to detail and Vastu expertise made our commercial project stand out in the market.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
];

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, servicesRes] = await Promise.all([
          getProjects({ featured: 'true' }),
          getServices(),
        ]);
        setFeaturedProjects(projectsRes.data.slice(0, 3));
        setServices(servicesRes.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-charcoal-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 animate-slide-up">
          <p className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-4">
            Architecture &bull; Interiors &bull; Vastu
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white max-w-4xl leading-tight mb-6">
            Crafting Spaces of Beauty & Harmony
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Where modern architecture meets traditional Vastu wisdom — transforming your vision
            into functional, luxurious, and harmonious living spaces.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/appointment" className="btn-primary">
              Book Appointment
            </Link>
            <Link to="/projects" className="btn-outline border-white text-white hover:bg-white hover:text-charcoal-900">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Welcome</p>
            <h2 className="section-title">Designing Tomorrow&apos;s Landmarks</h2>
            <p className="text-charcoal-600 leading-relaxed mb-4">
              VastuSoundarya is a premier architecture, civil consultancy, and interior design firm
              dedicated to creating spaces that inspire. With over 15 years of experience, we combine
              cutting-edge design with time-honored Vastu principles.
            </p>
            <p className="text-charcoal-600 leading-relaxed">
              From residential villas to commercial complexes, every project reflects our commitment
              to excellence, sustainability, and client satisfaction.
            </p>
            <Link to="/about" className="inline-block mt-6 text-gold-600 font-medium hover:text-gold-700 transition-colors">
              Learn More About Us &rarr;
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
              alt="Interior design"
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold-600 text-white p-6 hidden md:block">
              <p className="font-display text-3xl">
                <CountUp end="15+" />
              </p>
              <p className="text-sm uppercase tracking-wider">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-charcoal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">What We Offer</p>
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle mx-auto">
              Comprehensive design and consultancy solutions for every stage of your project.
            </p>
          </div>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Why VastuSoundarya</p>
            <h2 className="section-title">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Vastu Expertise', desc: 'Certified Vastu consultants ensuring positive energy flow in every design.' },
              { title: 'End-to-End Service', desc: 'From concept to completion — planning, design, drawings, and supervision.' },
              { title: 'Premium Quality', desc: 'Luxury materials, meticulous craftsmanship, and attention to every detail.' },
              { title: 'Client-Centric', desc: 'Your vision drives our process with transparent communication throughout.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold-600 flex items-center justify-center">
                  <span className="text-gold-600 text-2xl">✦</span>
                </div>
                <h3 className="font-display text-lg mb-2">{item.title}</h3>
                <p className="text-charcoal-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vastu + Modern Architecture */}
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-400 uppercase tracking-widest text-sm mb-2">Our Philosophy</p>
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Vastu Meets Modern Architecture
            </h2>
            <p className="text-charcoal-300 leading-relaxed mb-4">
              We believe the best spaces honor both innovation and tradition. Our designs integrate
              Vastu Shastra principles — directional alignment, spatial harmony, and energy balance —
              with contemporary aesthetics and smart functionality.
            </p>
            <p className="text-charcoal-300 leading-relaxed">
              The result: homes and workplaces that look stunning, feel right, and support prosperity
              and well-being for generations.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
            alt="Modern Vastu architecture"
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Portfolio</p>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <Link to="/projects" className="text-gold-600 font-medium hover:text-gold-700 mt-4 md:mt-0">
              View All Projects &rarr;
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-charcoal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Testimonials</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-gold-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-gold-100 mb-8 text-lg">
            Schedule a consultation with our design experts today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/appointment" className="btn-outline border-white text-white hover:bg-white hover:text-gold-700">
              Book Appointment
            </Link>
            <Link to="/contact" className="bg-charcoal-900 text-white px-6 py-3 uppercase text-sm tracking-wide hover:bg-charcoal-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
