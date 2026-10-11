import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const CATEGORY_COLORS = ['#A67524', '#1A1A1A', '#6B7F4A', '#8B5E3C', '#C4922E', '#515151', '#855A1E'];
const APPOINTMENT_COLORS = { Pending: '#D97706', Accepted: '#047857', Rejected: '#B45309' };
const STATUS_COLORS = { Completed: '#A67524', Ongoing: '#3F5E7A', Upcoming: '#818181' };

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-sm border border-charcoal-100 p-5 md:p-6 h-full">
    <div className="mb-4">
      <h2 className="font-display text-lg text-charcoal-900">{title}</h2>
      {subtitle && <p className="text-charcoal-500 text-xs mt-1 uppercase tracking-wider">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const EmptyChart = ({ message }) => (
  <div className="h-64 flex items-center justify-center text-center px-4">
    <p className="text-charcoal-400 text-sm">{message}</p>
  </div>
);

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-charcoal-900 text-white text-xs px-3 py-2 rounded-sm shadow-lg">
      <p className="font-medium">{item.name || item.label}</p>
      <p className="text-gold-300 mt-1">
        {item.count} {item.percentage != null ? `(${item.percentage}%)` : ''}
      </p>
    </div>
  );
};

const PieLegend = ({ data, colors }) => (
  <ul className="mt-4 space-y-2">
    {data.map((item, index) => (
      <li key={item.name} className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 text-charcoal-700">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: typeof colors === 'function' ? colors(item, index) : colors[index % colors.length] }}
          />
          {item.name}
        </span>
        <span className="text-charcoal-500">
          {item.count} · {item.percentage}%
        </span>
      </li>
    ))}
  </ul>
);

const hasValues = (data) => data?.some((item) => item.count > 0);
const pieSlices = (data) => (data || []).filter((item) => item.count > 0);

export const CategoryPieChart = ({ data }) => {
  if (!hasValues(data)) {
    return (
      <ChartCard title="Projects by Category" subtitle="Live portfolio mix">
        <EmptyChart message="No projects uploaded yet. Add a project to see category insights." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Projects by Category" subtitle="Live portfolio mix">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieSlices(data)} dataKey="count" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
              {pieSlices(data).map((entry) => {
                const colorIndex = data.findIndex((item) => item.name === entry.name);
                return <Cell key={entry.name} fill={CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length]} />;
              })}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieLegend data={data} colors={CATEGORY_COLORS} />
    </ChartCard>
  );
};

export const AppointmentPieChart = ({ data }) => {
  if (!hasValues(data)) {
    return (
      <ChartCard title="Appointments by Status" subtitle="Pending · Accepted · Rejected">
        <EmptyChart message="No appointment requests yet." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Appointments by Status" subtitle="Pending · Accepted · Rejected">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={APPOINTMENT_COLORS[entry.name] || '#A4A4A4'} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieLegend data={data} colors={(item) => APPOINTMENT_COLORS[item.name] || '#A4A4A4'} />
    </ChartCard>
  );
};

export const ProjectStatusPieChart = ({ data }) => {
  if (!hasValues(data)) {
    return (
      <ChartCard title="Projects by Status" subtitle="Completed · Ongoing · Upcoming">
        <EmptyChart message="No project status data available yet." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Projects by Status" subtitle="Completed · Ongoing · Upcoming">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#A4A4A4'} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieLegend data={data} colors={(item) => STATUS_COLORS[item.name] || '#A4A4A4'} />
    </ChartCard>
  );
};

export const ProjectsOverTimeChart = ({ data }) => {
  const hasUploads = data?.some((item) => item.count > 0);

  return (
    <ChartCard title="Projects uploaded over time" subtitle="Last 12 months">
      {!hasUploads ? (
        <EmptyChart message="No monthly upload activity yet." />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid stroke="#E3E3E3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#666666' }} interval={0} angle={-35} textAnchor="end" height={56} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#666666' }} />
              <Tooltip
                cursor={{ fill: 'rgba(166, 117, 36, 0.08)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-charcoal-900 text-white text-xs px-3 py-2 rounded-sm shadow-lg">
                      <p>{item.label}</p>
                      <p className="text-gold-300 mt-1">{item.count} project{item.count === 1 ? '' : 's'}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="#A67524" radius={[2, 2, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};
