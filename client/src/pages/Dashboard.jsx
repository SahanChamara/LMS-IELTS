import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/card";

const DASHBOARD_DATA = {
  banner: {
    title: "E-Learning Domain for Upgrading Competence and Teaching Excellence",
    logoText: "EDUCATE",
  },
  stats: [
    { title: "Enrolled Courses", value: "8,532" },
    { title: "Courses Completed", value: "132" },
    { title: "Certificates Earned", value: "47" },
    { title: "New Messages", value: "285" },
  ],
  chart: {
    title: "Weekly User Engagement",
    data: [
      { name: "Mon", users: 400 },
      { name: "Tue", users: 600 },
      { name: "Wed", users: 300 },
      { name: "Thu", users: 500 },
      { name: "Fri", users: 700 },
    ],
  },
};

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex bg-gray-50 text-gray-800 overflow-hidden"
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 h-full overflow-y-auto p-6 space-y-8">
        <DashboardContent />
      </div>
    </motion.div>
  );
};

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <Banner />
      <StatsGrid />
      <EngagementChart />
      <ExtraSections />
    </div>
  );
};

const Banner = () => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6 border border-gray-200"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-32 h-16 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-lg font-bold shadow-inner border border-gray-300">
      {DASHBOARD_DATA.banner.logoText}
    </div>
    <h2 className="text-lg font-medium text-gray-700">
      {DASHBOARD_DATA.banner.title}
    </h2>
  </motion.div>
);

const StatsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {DASHBOARD_DATA.stats.map((stat, index) => (
      <StatCard key={index} title={stat.title} value={stat.value} />
    ))}
  </div>
);

const StatCard = ({ title, value }) => (
  <Card className="bg-white border border-gray-200 shadow-sm mt-12">
    <CardContent>
      <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </CardContent>
  </Card>
);

const EngagementChart = () => (
  <Card className="p-6 bg-white border border-gray-200 shadow-sm ">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      {DASHBOARD_DATA.chart.title}
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={DASHBOARD_DATA.chart.data}>
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const ExtraSections = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {/* Recent */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Recent</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Enrolled in “React Basics”</li>
          <li>• Completed Quiz: JS Fundamentals</li>
          <li>• New instructor feedback</li>
        </ul>
      </Card>

      {/* News & Announcements */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">News & Announcements</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• New course launched: “AI for Beginners”</li>
          <li>• Sunday maintenance: 10PM – 12AM</li>
          <li>• New badge rewards system</li>
        </ul>
      </Card>

      {/* Updates */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Updates</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Dashboard UI improvements</li>
          <li>• Fixed quiz result issue</li>
          <li>• Enhanced notification settings</li>
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
