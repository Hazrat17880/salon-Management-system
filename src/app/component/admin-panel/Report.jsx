import React from 'react';

// Sample data that should be fetched from an API or passed as props in a real application
const sampleReports = [
  { id: 1, type: 'Revenue Report', period: 'Jan 2023 - Mar 2023', generated: 'Mar 31, 2023', total: '12,845' },
  { id: 2, type: 'Booking Trends', period: 'Feb 2023 - Mar 2023', generated: 'Apr 2, 2023' },
  { id: 3, type: 'Customer Growth', period: 'Q1 2023', generated: 'Apr 5, 2023' },
];

const sampleSalons = [
  { id: 1, name: 'Elegance Salon' },
  { id: 2, name: 'Urban Cuts' },
  { id: 3, name: 'Hair Haven' },
  { id: 4, name: 'Beauty Palace' },
  { id: 5, name: 'Style Studio' },
  { id: 6, name: 'The Glam Room' },
];

const sampleServices = [
  { id: 1, name: 'Haircut & Styling' },
  { id: 2, name: 'Hair Coloring' },
  { id: 3, name: 'Manicure' },
  { id: 4, name: 'Pedicure' },
  { id: 5, name: 'Facial Treatment' },
  { id: 6, name: 'Waxing' },
];

const Report = () => {
  // In a real app, you would likely fetch this data or get it via props
  const [reports] = React.useState(sampleReports);
  const [salons] = React.useState(sampleSalons);
  const [services] = React.useState(sampleServices);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reports & Analysis</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Generated Reports</h3>
        </div>
        <div className="divide-y">
          {reports.map(report => (
            <div key={report.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{report.type}</p>
                  <p className="text-sm text-gray-500">{report.period} • Generated on {report.generated}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {report.total && (
                    <p className="font-medium">${report.total}</p>
                  )}
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500">
              <option>Revenue Report</option>
              <option>Booking Trends</option>
              <option>Customer Growth</option>
              <option>Service Performance</option>
              <option>Salon Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Salons */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Top Performing Salons</h3>
          <div className="space-y-3">
            {salons.slice(0, 5).map((salon, index) => (
              <div key={salon.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{salon.name}</span>
                </div>
                <span className="font-medium">${(Math.random() * 5000 + 1000).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Booked Services */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Most Booked Services</h3>
          <div className="space-y-3">
            {services.slice(0, 5).map((service, index) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{service.name}</span>
                </div>
                <span className="font-medium">{Math.floor(Math.random() * 100) + 20} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;