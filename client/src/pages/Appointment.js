import { useState } from 'react';
import { createAppointment } from '../services/apiService';
import Alert from '../components/Alert';

const projectTypes = [
  'Residential',
  'Commercial',
  'Interior',
  'Vastu Consultation',
  'Architectural Planning',
  'Other',
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const Appointment = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      await createAppointment(form);
      setAlert({
        type: 'success',
        message: 'Appointment booked successfully! We will contact you shortly.',
      });
      setForm({
        name: '', email: '', phone: '', projectType: '',
        preferredDate: '', preferredTime: '', message: '',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to book appointment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-charcoal-200 rounded-sm focus:outline-none focus:border-gold-600 transition-colors';

  return (
    <>
      <section className="relative py-32 bg-charcoal-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Modern Residential Architecture"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/85 via-charcoal-900/75 to-charcoal-900/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Book an Appointment</h1>
          <p className="text-charcoal-300 text-lg max-w-2xl mx-auto">
            Schedule a consultation with our design experts
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-2xl mx-auto">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Phone *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Project Type *</label>
                <select name="projectType" value={form.projectType} onChange={handleChange} required className={inputClass}>
                  <option value="">Select type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Preferred Time *</label>
                <select name="preferredTime" value={form.preferredTime} onChange={handleChange} required className={inputClass}>
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                placeholder="Tell us about your project..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Appointment;
