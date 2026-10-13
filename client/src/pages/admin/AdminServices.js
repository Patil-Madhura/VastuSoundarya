import { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const emptyForm = {
  title: '',
  description: '',
  shortDescription: '',
  icon: 'building',
  order: 0,
  isActive: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = () => {
    getServices({ all: 'true' })
      .then((res) => setServices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (service) => {
    setForm({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription || '',
      icon: service.icon || 'building',
      order: service.order || 0,
      isActive: service.isActive,
    });
    setImage(null);
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    try {
      if (editingId) {
        await updateService(editingId, formData);
        setAlert({ type: 'success', message: 'Service updated' });
      } else {
        await createService(formData);
        setAlert({ type: 'success', message: 'Service created' });
      }
      setShowForm(false);
      fetchServices();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setAlert({ type: 'success', message: 'Service deleted' });
      fetchServices();
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    }
  };

  const inputClass = 'w-full min-h-[44px] px-3 py-2 border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-gold-600';

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="font-display text-2xl">Services</h1>
        <button type="button" onClick={openCreate} className="btn-primary text-xs py-2 admin-touch">Add Service</button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {showForm && (
        <div className="admin-panel">
          <h2 className="font-medium mb-4">{editingId ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
            <input placeholder="Icon key" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass} />
            <input placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
            <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) })} className={inputClass} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputClass} admin-form-span`} />
            <label className="flex items-center gap-2 text-sm min-h-[44px]">
              <input type="checkbox" className="h-4 w-4" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
            <div>
              <label className="block text-sm mb-2">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="admin-file-input" />
            </div>
            <div className="admin-form-actions">
              <button type="submit" disabled={submitting} className="btn-primary text-xs py-2 admin-touch disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-charcoal-200 rounded-sm admin-touch">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <>
          <div className="admin-card-list">
            {services.map((s) => (
              <article key={s._id} className="admin-record-card">
                <h3 className="font-medium break-words">{s.title}</h3>
                <p className="text-sm text-charcoal-500 mt-1">Order {s.order} · {s.isActive ? 'Active' : 'Inactive'}</p>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => openEdit(s)} className="text-gold-600 admin-touch px-2">Edit</button>
                  <button type="button" onClick={() => handleDelete(s._id)} className="text-red-500 admin-touch px-2">Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-table-wrap">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="bg-charcoal-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Active</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {services.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3">{s.title}</td>
                    <td className="px-4 py-3">{s.order}</td>
                    <td className="px-4 py-3">{s.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button type="button" onClick={() => openEdit(s)} className="text-gold-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(s._id)} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminServices;
