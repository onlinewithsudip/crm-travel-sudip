
import React from 'react';
import { Vehicle } from '../types';
// Fixed: Removed 'Tool' which is not exported by lucide-react, and other unused icons.
import { Car, MapPin } from 'lucide-react';

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', model: 'Toyota Fortuner', type: 'SUV', plateNumber: 'ABC-123', status: 'Available' },
  { id: 'v2', model: 'Mercedes Sprinter', type: 'Bus', plateNumber: 'BUS-789', status: 'On Trip', currentDriver: 'Robert Chen' },
  { id: 'v3', model: 'Honda Odyssey', type: 'Mini-Bus', plateNumber: 'FAM-456', status: 'Maintenance' },
  { id: 'v4', model: 'Toyota Camry', type: 'Sedan', plateNumber: 'TAX-001', status: 'Available' },
];

const Vehicles: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fleet Management</h1>
          <p className="text-slate-500">Track vehicle status and trip assignments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_VEHICLES.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                vehicle.status === 'On Trip' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
              }`}>
                <Car size={24} />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                vehicle.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                vehicle.status === 'On Trip' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{vehicle.model}</h3>
            <p className="text-slate-500 text-sm">{vehicle.plateNumber} • {vehicle.type}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Last Service</span>
                <span className="text-slate-700">12 Oct 2023</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Driver</span>
                <span className="text-slate-700 font-medium">{vehicle.currentDriver || 'None Assigned'}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Manage Vehicle
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Current Assignments</h3>
        </div>
        <div className="p-8 text-center text-slate-400">
           <MapPin className="mx-auto mb-2 opacity-20" size={48} />
           <p className="text-sm font-medium">Interactive Fleet Map Coming Soon</p>
           <p className="text-xs">Real-time GPS tracking integration is in progress.</p>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
