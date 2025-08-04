import { motion } from "framer-motion";
import AppointmentCard from "./Appointment";

const DashboardContent = ({ appointments }) => {
  const stats = [
    { name: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'Salons', value: 4 },
    { name: 'Messages', value: 2 }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xs md:text-sm text-gray-500 font-medium">{stat.name}</h3>
            <p className="text-xl md:text-3xl font-bold text-indigo-600 mt-1 md:mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Appointments</h3>
          <button className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {appointments.slice(0, 3).map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;