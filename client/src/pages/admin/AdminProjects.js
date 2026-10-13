import { useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
  getCategories,
} from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const emptyForm = {
  name: '',
  category: '',
  location: '',
  description: '',
  status: 'Completed',
  completionInfo: '',
  featured: false,
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = () => {
    getProjects()
      .then((res) => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    getCategories({ all: 'true' })
      .then((res) => {
        const active = res.data.filter((c) => c.isActive);
        setCategories(active);
        setForm((prev) => ({
          ...prev,
          category: prev.category || active[0]?.name || '',
        }));
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      category: categories[0]?.name || '',
    });
    setImages([]);
    setExistingImages([]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setForm({
      name: project.name,
      category: project.category,
      location: project.location,
      description: project.description,
      status: project.status,
      completionInfo: project.completionInfo || '',
      featured: project.featured,
    });
    setImages([]);
    setExistingImages(project.images || []);
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ type: '', message: '' });

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    images.forEach((file) => formData.append('images', file));

    try {
      if (editingId) {
        await updateProject(editingId, formData);
        setAlert({ type: 'success', message: 'Project updated successfully' });
      } else {
        await createProject(formData);
        setAlert({ type: 'success', message: 'Project created successfully' });
      }
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Operation failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setAlert({ type: 'success', message: 'Project deleted' });
      fetchProjects();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Delete failed' });
    }
  };

  const handleRemoveImage = async (publicId) => {
    if (!editingId || !window.confirm('Remove this image?')) return;
    try {
      const { data } = await deleteProjectImage(editingId, publicId);
      setExistingImages(data.images || []);
      setAlert({ type: 'success', message: 'Image removed' });
      fetchProjects();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to remove image' });
    }
  };

  const inputClass =
    'w-full min-h-[44px] px-3 py-2 border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-gold-600';

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="font-display text-2xl">Projects</h1>
        <button type="button" onClick={openCreate} className="btn-primary text-xs py-2 admin-touch" disabled={!categories.length}>
          Add Project
        </button>
      </div>

      {!categories.length && (
        <p className="text-sm text-amber-700 mb-4">
          Add at least one category under Categories before creating projects.
        </p>
      )}

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {showForm && (
        <div className="admin-panel">
          <h2 className="font-medium mb-4">{editingId ? 'Edit Project' : 'New Project'}</h2>
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <input
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className={inputClass}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
            <input
              placeholder="Completion Info"
              value={form.completionInfo}
              onChange={(e) => setForm({ ...form, completionInfo: e.target.value })}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm min-h-[44px]">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured Project
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className={`${inputClass} admin-form-span`}
            />

            {editingId && existingImages.length > 0 && (
              <div className="admin-form-span">
                <p className="text-sm mb-2">Existing Images</p>
                <div className="admin-image-grid">
                  {existingImages.map((img) => (
                    <div key={img.publicId} className="relative aspect-square">
                      <img src={img.url} alt="" className="w-full h-full object-cover rounded-sm border border-charcoal-100" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.publicId)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full text-sm"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="admin-form-span">
              <label className="block text-sm mb-2">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="admin-file-input"
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" disabled={submitting} className="btn-primary text-xs py-2 admin-touch disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-charcoal-200 rounded-sm admin-touch"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <>
          <div className="admin-card-list">
            {projects.map((p) => (
              <article key={p._id} className="admin-record-card">
                <h3 className="font-medium break-words">{p.name}</h3>
                <p className="text-sm text-charcoal-500 mt-1">{p.category} · {p.status}</p>
                <p className="text-xs text-charcoal-400 mt-1">{p.featured ? 'Featured' : 'Not featured'}</p>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => openEdit(p)} className="text-gold-600 hover:text-gold-700 admin-touch px-2">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600 admin-touch px-2">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-table-wrap">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-charcoal-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Featured</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{p.status}</td>
                    <td className="px-4 py-3">{p.featured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button type="button" onClick={() => openEdit(p)} className="text-gold-600 hover:text-gold-700">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
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

export default AdminProjects;
