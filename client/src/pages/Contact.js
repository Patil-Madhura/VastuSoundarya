import { useState } from 'react';
import { createEnquiry } from '../services/apiService';
import Alert from '../components/Alert';
import { contactInfo } from '../data/contactInfo';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      await createEnquiry(form);
      setAlert({ type: 'success', message: 'Your enquiry has been submitted. We will get back to you soon!' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-charcoal-200 rounded-sm focus:outline-none focus:border-gold-600 transition-colors';

  return (
    <>
      <section className="relative py-32 bg-charcoal-900">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Contact Us</h1>
          <p className="text-charcoal-300 text-lg">We&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl mb-6">Get in Touch</h2>
            <div className="space-y-6 text-charcoal-600">
              <div>
                <h3 className="font-medium text-charcoal-900 mb-1">Contact No.</h3>
                <p>
                  <a href={contactInfo.phoneHref} className="hover:text-gold-600">
                    {contactInfo.phone}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900 mb-1">Email</h3>
                <p>
                  <a href={contactInfo.emailHref} className="hover:text-gold-600">
                    {contactInfo.email}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900 mb-1">Address</h3>
                <p>{contactInfo.address}</p>
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900 mb-1">LinkedIn</h3>
                <p>
                  <a
                    href={contactInfo.linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-600 break-all"
                  >
                    {contactInfo.linkedinLabel}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900 mb-1">Working Hours</h3>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div>
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Name *</label>
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
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Subject *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
