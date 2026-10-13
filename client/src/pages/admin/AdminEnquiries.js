import { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const statusOptions = ['New', 'In Progress', 'Resolved'];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchEnquiries = () => {
    getEnquiries()
      .then((res) => setEnquiries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      setAlert({ type: 'success', message: status === 'Resolved' ? 'Enquiry resolved' : 'Status updated' });
      fetchEnquiries();
    } catch {
      setAlert({ type: 'error', message: 'Update failed' });
    }
  };

  const handleResolve = (id) => handleStatusChange(id, 'Resolved');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      setAlert({ type: 'success', message: 'Enquiry deleted' });
      fetchEnquiries();
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-6 sm:mb-8">Enquiries</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : enquiries.length === 0 ? (
        <p className="text-charcoal-500">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq._id} className="bg-white p-4 sm:p-6 rounded-sm border border-charcoal-100">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-3">
                <div className="min-w-0">
                  <h3 className="font-medium break-words">{enq.name}</h3>
                  <p className="text-sm text-charcoal-500 break-all">{enq.email} &bull; {enq.phone}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    className="text-sm border border-charcoal-200 rounded px-3 py-2 min-h-[44px] w-full sm:w-auto"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {enq.status !== 'Resolved' && (
                    <button type="button" onClick={() => handleResolve(enq._id)} className="text-green-600 text-xs admin-touch px-2">
                      Resolve
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(enq._id)} className="text-red-500 text-xs admin-touch px-2">Delete</button>
                </div>
              </div>
              <p className="font-medium text-sm mb-1 break-words">{enq.subject}</p>
              <p className="text-charcoal-600 text-sm break-words">{enq.message}</p>
              <p className="text-charcoal-400 text-xs mt-2">
                {new Date(enq.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
