import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Users, Filter, ChevronDown, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
    // Filter States
    const [selectedDept, setSelectedDept] = React.useState('');
    const [selectedSection, setSelectedSection] = React.useState('');
    const [selectedLine, setSelectedLine] = React.useState('');

    // Dynamic Data State
    const [metrics, setMetrics] = React.useState({
        workforce: 0,
        manpower: [],
        attrition: [],
        skills: []
    });

    // Dummy Options
    const departments = ['Production', 'Quality', 'Maintenance', 'Logistics'];
    const sections = ['Assembly', 'Machining', 'Painting', 'Testing'];
    const lines = ['Line 1', 'Line 2', 'Line 3', 'Line A', 'Line B'];

    // Data Generator for Simulation
    React.useEffect(() => {
        // Base values (All Departments)
        let baseTotal = 1250;
        let baseReq = 520;
        let baseActual = 483;

        // Adjust based on filters to simulate data changes
        if (selectedDept === 'Production') { baseTotal = 850; baseReq = 400; baseActual = 380; }
        else if (selectedDept === 'Quality') { baseTotal = 150; baseReq = 60; baseActual = 55; }
        else if (selectedDept === 'Maintenance') { baseTotal = 120; baseReq = 40; baseActual = 38; }
        else if (selectedDept === 'Logistics') { baseTotal = 130; baseReq = 20; baseActual = 10; }

        if (selectedSection) {
            baseTotal = Math.round(baseTotal * 0.3);
            baseReq = Math.round(baseReq * 0.3);
            baseActual = Math.round(baseActual * 0.3);
        }

        if (selectedLine) {
            baseTotal = Math.round(baseTotal * 0.15); // Lines are smaller
            baseReq = Math.round(baseReq * 0.15);
            baseActual = Math.max(0, baseReq - Math.floor(Math.random() * 5));
        }

        const buffer = Math.max(0, baseActual - baseReq + 10); // Artificial buffer

        // Generate Attrition Curve
        const attritionData = Array.from({ length: 10 }, (_, i) => ({
            date: `Jan ${10 + i}`,
            rate: Math.floor(140 + (Math.random() * 10) - 5) // oscillates around 140
        }));

        // Generate Skill Data
        const sL4 = Math.round(baseActual * 0.05);
        const sL3 = Math.round(baseActual * 0.15);
        const sL2 = Math.round(baseActual * 0.20);
        const sL1 = baseActual - sL4 - sL3 - sL2;

        setMetrics({
            workforce: baseTotal,
            manpower: [
                { name: 'Required', value: baseReq, color: 'bg-blue-500' },
                { name: 'Actual', value: baseActual, color: 'bg-emerald-500' },
                { name: 'Buffer', value: buffer, color: 'bg-amber-400' },
            ],
            attrition: attritionData,
            skills: [
                { level: 'L4', avail: sL4, req: Math.round(baseReq * 0.05), color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { level: 'L3', avail: sL3, req: Math.round(baseReq * 0.15), color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { level: 'L2', avail: sL2, req: Math.round(baseReq * 0.20), color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { level: 'L1', avail: sL1, req: Math.round(baseReq * 0.60), color: 'text-purple-600 bg-purple-50 border-purple-200' },
            ]
        });

    }, [selectedDept, selectedSection, selectedLine]);

    // Custom Select Component for cleaner look

    // Custom Select Component for cleaner look
    const SelectInput = ({ value, onChange, options, placeholder }) => (
        <div className="relative min-w-[180px]">
            <select
                value={value}
                onChange={onChange}
                className="appearance-none w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-2.5 pr-8 shadow-sm transition-all hover:border-slate-300"
            >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
                    <p className="text-slate-500 text-sm">Real-time manpower and efficiency metrics</p>
                </div>
                <div className="mt-4 md:mt-0 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Live Data Updates
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                    <Filter className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-700 font-bold text-xs tracking-wider">FILTERS</span>
                </div>

                <SelectInput
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    options={departments}
                    placeholder="All Departments"
                />
                <SelectInput
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    options={sections}
                    placeholder="All Sections"
                />
                <SelectInput
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    options={lines}
                    placeholder="All Lines"
                />

                {(selectedDept || selectedSection || selectedLine) && (
                    <button
                        onClick={() => { setSelectedDept(''); setSelectedSection(''); setSelectedLine(''); }}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 ml-auto px-3 py-1.5 bg-red-50 rounded-md transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                {/* 1. Workforce Stats Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between col-span-1 lg:col-span-3 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    {/* Decorative Blob */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300"></div>

                    <div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Total Workforce</h3>
                            <Activity className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-5xl font-extrabold text-slate-800">{metrics.workforce}</span>
                                <span className="text-sm font-medium text-slate-400">employees</span>
                            </div>
                            <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2 py-1 rounded">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>+2.4% vs last month</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between items-end relative z-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-xs font-semibold text-slate-600">Global Count: {metrics.workforce}</span>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Manpower Availability */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 col-span-1 lg:col-span-7 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-800 font-bold text-base">Manpower Availability</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold">View Details</button>
                    </div>

                    <div className="flex-1 flex justify-around items-end pb-2 gap-4">
                        {/* Custom Bar Visuals */}
                        {metrics.manpower.length > 0 && (
                            <>
                                <div className="flex-1 max-w-[150px] flex flex-col items-center group">
                                    <div className="mb-3 text-center">
                                        <span className="block text-2xl font-bold text-slate-800">{metrics.manpower[0].value}</span>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Required</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-t-xl relative h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-blue-500 rounded-t-xl transition-all duration-700 group-hover:bg-blue-600"
                                            style={{ height: '85%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex-1 max-w-[150px] flex flex-col items-center group">
                                    <div className="mb-3 text-center">
                                        <span className="block text-2xl font-bold text-slate-800">{metrics.manpower[1].value}</span>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Actual</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-t-xl relative h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-emerald-500 rounded-t-xl transition-all duration-700 group-hover:bg-emerald-600"
                                            style={{ height: `${(metrics.manpower[1].value / metrics.manpower[0].value) * 85}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex-1 max-w-[150px] flex flex-col items-center group">
                                    <div className="mb-3 text-center">
                                        <span className="block text-2xl font-bold text-slate-800">{metrics.manpower[2].value}</span>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Buffer</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-t-xl relative h-48 overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-amber-400 rounded-t-xl transition-all duration-700 group-hover:bg-amber-500"
                                            style={{ height: '15%' }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Attrition Rate Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 col-span-1 lg:col-span-7">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Attrition Rate (YTD)</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-extrabold text-slate-800">
                                    {metrics.attrition.length > 0 ? metrics.attrition[metrics.attrition.length - 1].rate : 0}%
                                </span>
                                <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    High Risk
                                </span>
                            </div>
                        </div>
                        {/* Month Selector dummy */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-bold text-slate-600 bg-white shadow-sm rounded-md">30 Days</button>
                            <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800">90 Days</button>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.attrition}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Skill Level Availability */}
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 col-span-1 lg:col-span-3">
                    <h3 className="text-slate-800 font-bold text-sm mb-6">Skill Distribution</h3>
                    <div className="space-y-4">
                        {metrics.skills.map((skill) => (
                            <div key={skill.level} className={`p-4 rounded-xl border ${skill.color} transition-transform hover:-translate-y-1 duration-200`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-black text-xl">{skill.level}</span>
                                    {skill.avail >= skill.req ? (
                                        <span className="text-xs font-bold px-2 py-1 bg-white/50 rounded-md backdrop-blur-sm text-emerald-700">Surplus</span>
                                    ) : (
                                        <span className="text-xs font-bold px-2 py-1 bg-white/50 rounded-md backdrop-blur-sm text-red-700">Shortage</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-xs opacity-70 font-semibold uppercase">Available</span>
                                        <span className="font-bold text-lg">{skill.avail}</span>
                                    </div>
                                    <div className="h-8 w-px bg-current opacity-20 mx-2"></div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs opacity-70 font-semibold uppercase">Required</span>
                                        <span className="font-bold text-lg">{skill.req}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;