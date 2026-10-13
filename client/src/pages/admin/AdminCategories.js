import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const emptyForm = {
  name: '',
  description: '',
  isActive: true,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    getCategories({ all: 'true' })
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setAlert({ type: 'success', message: 'Category updated' });
      } else {
        await createCategory(form);
        setAlert({ type: 'success', message: 'Category created' });
      }
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Projects using it must be reassigned first.')) return;
    try {
      await deleteCategory(id);
      setAlert({ type: 'success', message: 'Category deleted' });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Delete failed' });
    }
  };

  const inputClass =
    'w-full min-h-[44px] px-3 py-2 border border-charcoal-200 rounded-sm text-sm focus:outline-none focus:border-gold-600';

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="font-display text-2xl">Categories</h1>
        <button type="button" onClick={openCreate} className="btn-primary text-xs py-2 admin-touch">
          Add Category
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {showForm && (
        <div className="admin-panel">
          <h2 className="font-medium mb-4">{editingId ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm min-h-[44px]">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
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
            {categories.map((c) => (
              <article key={c._id} className="admin-record-card">
                <h3 className="font-medium break-words">{c.name}</h3>
                <p className="text-sm text-charcoal-500 mt-1">{c.slug} · {c.isActive ? 'Active' : 'Inactive'}</p>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => openEdit(c)} className="text-gold-600 admin-touch px-2">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(c._id)} className="text-red-500 admin-touch px-2">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-table-wrap">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="bg-charcoal-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 font-medium">Active</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3 text-charcoal-500">{c.slug}</td>
                    <td className="px-4 py-3">{c.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button type="button" onClick={() => openEdit(c)} className="text-gold-600">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(c._id)} className="text-red-500">
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

export default AdminCategories;
