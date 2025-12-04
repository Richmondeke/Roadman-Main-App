
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoadmanCard, RoadmanButton } from './TronComponents';
import { getAdminDashboardData } from '../services/duffelService';
import { Order } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await getAdminDashboardData();
            setOrders(data.orders);
            setStats(data.stats);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.serviceType === filter);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
        {/* Admin Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Mission Control</h1>
                        <p className="text-xs text-brand-400 font-mono">ADMINISTRATOR_ACCESS_GRANTED</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">System Admin</p>
                        <p className="text-xs text-green-400">● Online</p>
                    </div>
                    <div className="w-10 h-10 bg-brand-900 rounded-full border border-brand-500 flex items-center justify-center text-brand-400 font-bold">
                        SA
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RoadmanCard className="border-t-4 border-t-green-500 !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-white mt-1">${stats.totalRevenue?.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-900/30 text-green-400 rounded-lg">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-xs text-green-400 font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        +12.5% from last week
                    </p>
                </RoadmanCard>

                <RoadmanCard className="border-t-4 border-t-brand-500 !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Active Bookings</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.activeBookings}</h3>
                        </div>
                        <div className="p-2 bg-brand-900/30 text-brand-400 rounded-lg">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-500 h-full w-[70%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">70% Capacity Reached</p>
                </RoadmanCard>

                <RoadmanCard className="border-t-4 border-t-yellow-500 !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Pending Approval</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.pendingApprovals}</h3>
                        </div>
                        <div className="p-2 bg-yellow-900/30 text-yellow-400 rounded-lg">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <button className="text-xs text-yellow-400 underline font-bold">Review Queue &rarr;</button>
                </RoadmanCard>

                <RoadmanCard className="border-t-4 border-t-purple-500 !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Flight Occupancy</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.occupancyRate}%</h3>
                        </div>
                        <div className="p-2 bg-purple-900/30 text-purple-400 rounded-lg">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div className="flex gap-1 h-3 mt-2">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className={`flex-1 rounded-sm ${i <= 6 ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </RoadmanCard>
            </div>

            {/* Booking Management Table */}
            <RoadmanCard className="!p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                    
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                        {['ALL', 'FLIGHTS', 'STAYS', 'CARS'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${filter === f ? 'bg-slate-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4">Reference</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        Loading bookings...
                                    </td>
                                </tr>
                            ) : filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <span className="font-mono text-brand-400">{order.booking_reference}</span>
                                        <div className="text-[10px] text-gray-500">{order.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {order.customerName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{order.customerName || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-500">{order.customerEmail || 'no-email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {order.serviceType === 'FLIGHTS' && <span className="p-1.5 bg-blue-900/30 text-blue-400 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></span>}
                                            {order.serviceType === 'STAYS' && <span className="p-1.5 bg-purple-900/30 text-purple-400 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg></span>}
                                            {order.serviceType === 'CARS' && <span className="p-1.5 bg-orange-900/30 text-orange-400 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span>}
                                            <span className="text-sm text-gray-300 font-medium">{order.serviceType}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-300">{new Date(order.date || Date.now()).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.date || Date.now()).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-mono text-sm font-bold text-white">{order.amount} {order.currency}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                            ${order.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border border-green-900' : ''}
                                            ${order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' : ''}
                                            ${order.status === 'cancelled' ? 'bg-red-900/30 text-red-400 border border-red-900' : ''}
                                        `}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-brand-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </RoadmanCard>
        </div>
    </div>
  );
};
