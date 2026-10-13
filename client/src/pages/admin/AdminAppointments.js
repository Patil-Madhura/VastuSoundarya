import { useEffect, useState } from 'react';
import { getAppointments, updateAppointment, deleteAppointment } from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const formatWhatsAppNumber = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 13 && digits.startsWith('091')) return digits.slice(1);
  return '';
};

const getWhatsAppMessage = (name, status) => {
  const safeName = name?.trim() || 'there';
  if (status === 'Cancelled') {
    return `Hello ${safeName}, regarding your VastuSoundarya appointment, unfortunately we are unable to accept your request at this time. Thank you for contacting us.`;
  }
  return `Hello ${safeName}, your VastuSoundarya appointment has been accepted. We look forward to meeting you. Thank you.`;
};

const openWhatsApp = (appointment) => {
  const number = formatWhatsAppNumber(appointment.phone);
  if (!number) return;
  const message = getWhatsAppMessage(appointment.name, appointment.status);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchAppointments = () => {
    getAppointments()
      .then((res) => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      setAlert({ type: 'success', message: 'Status updated' });
      fetchAppointments();
    } catch {
      setAlert({ type: 'error', message: 'Update failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await deleteAppointment(id);
      setAlert({ type: 'success', message: 'Appointment deleted' });
      fetchAppointments();
    } catch {
      setAlert({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-6 sm:mb-8">Appointments</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : appointments.length === 0 ? (
        <p className="text-charcoal-500">No appointments yet.</p>
      ) : (
        <>
          <div className="admin-card-list">
            {appointments.map((apt) => (
              <article key={apt._id} className="admin-record-card">
                <h3 className="font-medium break-words">{apt.name}</h3>
                <p className="text-sm text-charcoal-500 break-all">{apt.email}</p>
                <p className="text-sm text-charcoal-500">{apt.phone}</p>
                <p className="text-sm mt-2">{apt.projectType}</p>
                <p className="text-xs text-charcoal-400 mt-1">
                  {new Date(apt.preferredDate).toLocaleDateString()} · {apt.preferredTime}
                </p>
                <select
                  value={apt.status}
                  onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                  className="mt-3 w-full min-h-[44px] text-sm border border-charcoal-200 rounded px-3"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="admin-record-actions">
                  {formatWhatsAppNumber(apt.phone) && (
                    <button
                      type="button"
                      onClick={() => openWhatsApp(apt)}
                      className="inline-flex items-center justify-center px-3 py-2 text-xs border border-green-600 text-green-700 hover:bg-green-600 hover:text-white rounded-sm transition-colors admin-touch"
                    >
                      Send WhatsApp Message
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(apt._id)} className="text-red-500 text-xs admin-touch px-2">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-table-wrap">
            <table className="w-full text-sm min-w-[860px]">
              <thead className="bg-charcoal-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Date/Time</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td className="px-4 py-3">{apt.name}</td>
                    <td className="px-4 py-3">
                      <div>{apt.email}</div>
                      <div className="text-charcoal-500 text-xs">{apt.phone}</div>
                    </td>
                    <td className="px-4 py-3">{apt.projectType}</td>
                    <td className="px-4 py-3">
                      <div>{new Date(apt.preferredDate).toLocaleDateString()}</div>
                      <div className="text-charcoal-500 text-xs">{apt.preferredTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        className="text-xs border border-charcoal-200 rounded px-2 py-2 min-h-[36px]"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-end gap-2">
                        {formatWhatsAppNumber(apt.phone) && (
                          <button
                            type="button"
                            onClick={() => openWhatsApp(apt)}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs border border-green-600 text-green-700 hover:bg-green-600 hover:text-white rounded-sm transition-colors whitespace-nowrap"
                          >
                            Send WhatsApp Message
                          </button>
                        )}
                        <button type="button" onClick={() => handleDelete(apt._id)} className="text-red-500 text-xs">
                          Delete
                        </button>
                      </div>
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

export default AdminAppointments;
