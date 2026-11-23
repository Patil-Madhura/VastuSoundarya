import CountUp from '../components/CountUp';

const About = () => {
  return (
    <>
      <section className="relative py-32 bg-charcoal-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
            alt="Architecture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">About Us</h1>
          <p className="text-charcoal-300 text-lg max-w-2xl mx-auto">
            Pioneering harmonious design since 2010
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Our Story</p>
            <h2 className="section-title">Building Dreams, One Space at a Time</h2>
            <p className="text-charcoal-600 leading-relaxed mb-4">
              Founded with a vision to bridge modern architectural excellence and ancient Vastu wisdom,
              VastuSoundarya has grown into a trusted name in residential, commercial, and interior design.
            </p>
            <p className="text-charcoal-600 leading-relaxed">
              Our team of architects, interior designers, and Vastu consultants work collaboratively to
              deliver projects that are aesthetically stunning, structurally sound, and energetically balanced.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
            alt="Team at work"
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: '15+', label: 'Years of Experience' },
              { number: '200+', label: 'Projects Completed' },
              { number: '150+', label: 'Happy Clients' },
            ].map((stat) => (
              <div key={stat.label} className="p-8 bg-white">
                <p className="font-display text-4xl text-gold-600 mb-2">
                  <CountUp end={stat.number} />
                </p>
                <p className="text-charcoal-600 uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Mission</p>
            <h2 className="font-display text-2xl mb-4">Our Mission</h2>
            <p className="text-charcoal-600 leading-relaxed">
              To create exceptional spaces that enhance quality of life by blending innovative design,
              sustainable practices, and Vastu principles — delivering value that exceeds client expectations.
            </p>
          </div>
          <div>
            <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Vision</p>
            <h2 className="font-display text-2xl mb-4">Our Vision</h2>
            <p className="text-charcoal-600 leading-relaxed">
              To be India&apos;s most trusted design consultancy, recognized for transforming spaces into
              landmarks of beauty, functionality, and positive energy.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-400 uppercase tracking-widest text-sm mb-2">Approach</p>
            <h2 className="font-display text-3xl md:text-4xl">Design Philosophy</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Form Follows Function',
                desc: 'Every design decision serves a purpose — beauty and utility in perfect balance.',
              },
              {
                title: 'Harmony & Balance',
                desc: 'Vastu-aligned layouts that promote health, prosperity, and peace of mind.',
              },
              {
                title: 'Sustainable Excellence',
                desc: 'Eco-conscious materials and energy-efficient designs for a better tomorrow.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-charcoal-700 p-8">
                <h3 className="font-display text-xl mb-3 text-gold-400">{item.title}</h3>
                <p className="text-charcoal-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Process</p>
          <h2 className="section-title">Project Management Approach</h2>
          <p className="text-charcoal-600 leading-relaxed mb-8">
            We follow a structured, transparent process: Discovery &rarr; Concept Design &rarr; Detailed
            Planning &rarr; Approvals &rarr; Execution Support &rarr; Handover. Regular updates, milestone
            reviews, and quality checks ensure your project stays on track and on budget.
          </p>
        </div>
      </section>
    </>
  );
};

export default About;
