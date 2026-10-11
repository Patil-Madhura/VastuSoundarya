const Project = require('../models/Project');
const Appointment = require('../models/Appointment');
const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const countByKey = (rows, key) =>
  rows.reduce((sum, row) => (row._id === key ? sum + row.count : sum), 0);

const lastTwelveMonths = (monthlyRows) => {
  const now = new Date();
  const lookup = new Map(
    monthlyRows.map((row) => [`${row._id.year}-${row._id.month}`, row.count])
  );

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return {
      year,
      month,
      label: `${MONTH_LABELS[month - 1]} ${year}`,
      count: lookup.get(`${year}-${month}`) || 0,
    };
  });
};

// @desc    Get dashboard statistics and chart series
// @route   GET /api/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [projectFacet, appointmentFacet, totalEnquiries, totalServices, recentProjects, recentAppointments, recentEnquiries] =
    await Promise.all([
      Project.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            byCategory: [{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
            byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
            byMonth: [
              {
                $group: {
                  _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                  count: { $sum: 1 },
                },
              },
              { $sort: { '_id.year': 1, '_id.month': 1 } },
            ],
          },
        },
      ]),
      Appointment.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          },
        },
      ]),
      Enquiry.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name category status location featured createdAt images'),
      Appointment.find().sort({ createdAt: -1 }).limit(5).select('name projectType status preferredDate createdAt'),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt'),
    ]);

  const projects = projectFacet[0] || { total: [], byCategory: [], byStatus: [], byMonth: [] };
  const appointments = appointmentFacet[0] || { total: [], byStatus: [] };

  const totalProjects = projects.total[0]?.count || 0;
  const totalAppointments = appointments.total[0]?.count || 0;
  const pendingAppointments = countByKey(appointments.byStatus, 'Pending');
  const acceptedAppointments =
    countByKey(appointments.byStatus, 'Confirmed') + countByKey(appointments.byStatus, 'Completed');
  const rejectedAppointments = countByKey(appointments.byStatus, 'Cancelled');

  const projectsByCategory = (projects.byCategory || []).map((row) => ({
    name: row._id || 'Uncategorized',
    count: row.count,
    percentage: totalProjects ? Math.round((row.count / totalProjects) * 1000) / 10 : 0,
  }));

  const projectsByStatus = ['Completed', 'Ongoing', 'Upcoming'].map((name) => {
    const count = countByKey(projects.byStatus, name);
    return {
      name,
      count,
      percentage: totalProjects ? Math.round((count / totalProjects) * 1000) / 10 : 0,
    };
  });

  const appointmentChartTotal = pendingAppointments + acceptedAppointments + rejectedAppointments;
  const appointmentsByStatus = [
    { name: 'Pending', count: pendingAppointments },
    { name: 'Accepted', count: acceptedAppointments },
    { name: 'Rejected', count: rejectedAppointments },
  ].map((row) => ({
    ...row,
    percentage: appointmentChartTotal
      ? Math.round((row.count / appointmentChartTotal) * 1000) / 10
      : 0,
  }));

  res.json({
    totalProjects,
    residentialProjects: countByKey(projects.byCategory, 'Residential'),
    commercialProjects: countByKey(projects.byCategory, 'Commercial'),
    interiorProjects: countByKey(projects.byCategory, 'Interior'),
    totalAppointments,
    pendingAppointments,
    acceptedAppointments,
    rejectedAppointments,
    totalEnquiries,
    totalServices,
    projectsByCategory,
    projectsByStatus,
    appointmentsByStatus,
    projectsByMonth: lastTwelveMonths(projects.byMonth || []),
    recentProjects,
    recentAppointments,
    recentEnquiries,
  });
});

module.exports = { getDashboardStats };
