import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/apiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  AppointmentPieChart,
  CategoryPieChart,
  ProjectStatusPieChart,
  ProjectsOverTimeChart,
} from '../../components/admin/DashboardCharts';

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white p-4 sm:p-5 rounded-sm border border-charcoal-100 hover:shadow-md transition-shadow duration-300 min-w-0">
    <p className="text-charcoal-500 text-[11px] uppercase tracking-[0.16em] leading-snug">{label}</p>
    <p className={`font-display text-2xl sm:text-3xl mt-2 ${accent}`}>{value ?? 0}</p>
  </div>
);

const statusClass = (status) => {
  if (status === 'Pending' || status === 'Upcoming') return 'bg-amber-100 text-amber-800';
  if (status === 'Cancelled' || status === 'Rejected') return 'bg-red-100 text-red-700';
  if (status === 'New') return 'bg-blue-100 text-blue-700';
  if (status === 'Ongoing') return 'bg-slate-100 text-slate-700';
  return 'bg-emerald-100 text-emerald-800';
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = () => {
    setLoading(true);
    setError('');
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {
        setStats(null);
        setError('Unable to load analytics. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner className="py-8" />
        <p className="text-center text-charcoal-500 text-sm mt-4">Loading live analytics…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white border border-charcoal-100 rounded-sm p-10 text-center">
        <p className="text-charcoal-600 mb-4">{error || 'Failed to load dashboard.'}</p>
        <button type="button" onClick={loadStats} className="btn-primary text-xs py-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <p className="text-gold-600 text-xs uppercase tracking-[0.25em] mb-2">Analytics</p>
        <h1 className="font-display text-2xl md:text-3xl text-charcoal-900">Dashboard</h1>
        <p className="text-charcoal-500 text-sm mt-2 max-w-2xl">
          Live overview of projects, appointments, and enquiries from your VastuSoundarya database.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total projects uploaded" value={stats.totalProjects} accent="text-gold-600" />
        <StatCard label="Residential projects" value={stats.residentialProjects} accent="text-charcoal-900" />
        <StatCard label="Commercial projects" value={stats.commercialProjects} accent="text-charcoal-900" />
        <StatCard label="Interior design projects" value={stats.interiorProjects} accent="text-charcoal-900" />
        <StatCard label="Total appointments received" value={stats.totalAppointments} accent="text-blue-700" />
        <StatCard label="Pending appointments" value={stats.pendingAppointments} accent="text-amber-600" />
        <StatCard label="Accepted appointments" value={stats.acceptedAppointments} accent="text-emerald-700" />
        <StatCard label="Rejected appointments" value={stats.rejectedAppointments} accent="text-red-700" />
        <StatCard label="Total contact enquiries" value={stats.totalEnquiries} accent="text-green-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <CategoryPieChart data={stats.projectsByCategory} />
        <AppointmentPieChart data={stats.appointmentsByStatus} />
        <ProjectStatusPieChart data={stats.projectsByStatus} />
      </div>

      <div className="mb-8">
        <ProjectsOverTimeChart data={stats.projectsByMonth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-sm border border-charcoal-100 overflow-hidden min-w-0">
          <div className="px-4 sm:px-6 py-4 border-b border-charcoal-100 flex items-center justify-between gap-3">
            <h2 className="font-display text-base sm:text-lg min-w-0">Latest uploaded projects</h2>
            <Link to="/admin/projects" className="text-xs uppercase tracking-wider text-gold-600 hover:text-gold-700 shrink-0">
              Manage
            </Link>
          </div>
          {stats.recentProjects?.length ? (
            <div className="divide-y divide-charcoal-100">
              {stats.recentProjects.map((project) => (
                <div key={project._id} className="px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 bg-charcoal-100 shrink-0 overflow-hidden rounded-sm">
                    {project.images?.[0]?.url ? (
                      <img src={project.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-charcoal-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <p className="text-charcoal-500 text-xs mt-0.5 break-words">
                      {project.category}
                      {project.location ? ` · ${project.location}` : ''}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded ${statusClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-charcoal-500 text-sm">No projects uploaded yet.</p>
          )}
        </div>

        <div className="bg-white rounded-sm border border-charcoal-100 overflow-hidden min-w-0">
          <div className="px-4 sm:px-6 py-4 border-b border-charcoal-100 flex items-center justify-between gap-3">
            <h2 className="font-display text-base sm:text-lg min-w-0">Recent appointment requests</h2>
            <Link to="/admin/appointments" className="text-xs uppercase tracking-wider text-gold-600 hover:text-gold-700 shrink-0">
              View all
            </Link>
          </div>
          {stats.recentAppointments?.length ? (
            <div className="divide-y divide-charcoal-100">
              {stats.recentAppointments.map((apt) => (
                <div key={apt._id} className="px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{apt.name}</p>
                    <p className="text-charcoal-500 text-xs truncate">{apt.projectType}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded shrink-0 ${statusClass(apt.status)}`}>
                    {apt.status === 'Confirmed' || apt.status === 'Completed'
                      ? 'Accepted'
                      : apt.status === 'Cancelled'
                        ? 'Rejected'
                        : apt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-charcoal-500 text-sm">No appointment requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
