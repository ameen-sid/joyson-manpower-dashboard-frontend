import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Users, Filter, ChevronDown, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../utils/api';
import { useFilters } from '../context/FilterContext';

const Dashboard = () => {
    // Global Filter State
    const { selectedDept, selectedSection, selectedLine } = useFilters();

    // Dynamic Data State
    const [metrics, setMetrics] = React.useState({
        workforce: 0,
        manpower: [],
        attrition: [],
        skills: []
    });

    // Data Fetching
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    department: selectedDept,
                    section: selectedSection,
                    line: selectedLine
                };

                // Fetch all data in parallel
                const [manpowerRes, skillsRes, attritionRes] = await Promise.all([
                    api.get('/dashboard/manpower', { params }),
                    api.get('/dashboard/skills', { params }),
                    api.get('/dashboard/attrition', { params })
                ]);

                const manpowerData = manpowerRes.data;
                const skillsData = skillsRes.data;
                const attritionData = attritionRes.data;

                // Color mapping helper
                const getSkillColor = (level) => {
                    switch (level) {
                        case 'L4': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
                        case 'L3': return 'text-blue-600 bg-blue-50 border-blue-200';
                        case 'L2': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
                        case 'L1': return 'text-purple-600 bg-purple-50 border-purple-200';
                        default: return 'text-slate-600 bg-slate-50 border-slate-200';
                    }
                };

                setMetrics({
                    workforce: manpowerData.actual,
                    manpower: [
                        { name: 'Required', value: manpowerData.required, color: 'bg-blue-500' },
                        { name: 'Actual', value: manpowerData.actual, color: 'bg-emerald-500' },
                        { name: 'Buffer', value: manpowerData.buffer, color: 'bg-amber-400' },
                    ],
                    attrition: attritionData.map(d => ({
                        date: d.month,
                        rate: d.rate
                    })),
                    skills: skillsData.map(s => ({
                        level: s.skill,
                        avail: s.available,
                        req: s.required,
                        color: getSkillColor(s.skill)
                    }))
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchData();

        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);

    }, [selectedDept, selectedSection, selectedLine]);

    return (
        <div className="space-y-6">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
                    <p className="text-slate-500 text-sm">Manpower and efficiency metrics</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

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
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 col-span-1 lg:col-span-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-800 font-bold text-base">Manpower Availability</h3>

                    </div>

                    <div className="flex-1 flex justify-around items-end gap-2 px-2">
                        {/* Custom Bar Visuals */}
                        {metrics.manpower.length > 0 && (() => {
                            const reqVal = metrics.manpower[0].value;
                            const actVal = metrics.manpower[1].value;
                            const bufVal = metrics.manpower[2].value;

                            // Find max value to normalize heights (at least 1 to avoid division by zero)
                            const maxVal = Math.max(reqVal, actVal, Math.abs(bufVal), 1);

                            // Calculate percentages (capped at 100%)
                            const getHeight = (val) => `${Math.min((Math.abs(val) / maxVal) * 100, 100)}%`;

                            return (
                                <>
                                    <div className="flex-1 max-w-[100px] flex flex-col items-center group">
                                        <div className="mb-2 text-center">
                                            <span className="block text-lg font-bold text-slate-800">{reqVal}</span>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Required</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-t-lg relative h-64 flex items-end justify-center overflow-hidden">
                                            <div
                                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-700 group-hover:bg-blue-600"
                                                style={{ height: getHeight(reqVal) }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-[100px] flex flex-col items-center group">
                                        <div className="mb-2 text-center">
                                            <span className="block text-lg font-bold text-slate-800">{actVal}</span>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Actual</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-t-lg relative h-64 flex items-end justify-center overflow-hidden">
                                            <div
                                                className="w-full bg-emerald-500 rounded-t-lg transition-all duration-700 group-hover:bg-emerald-600"
                                                style={{ height: getHeight(actVal) }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-[100px] flex flex-col items-center group">
                                        <div className="mb-2 text-center">
                                            <span className={`block text-lg font-bold ${bufVal < 0 ? 'text-red-500' : 'text-slate-800'}`}>{bufVal}</span>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Buffer</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-t-lg relative h-64 flex items-end justify-center overflow-hidden">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-700 ${bufVal < 0 ? 'bg-red-400 group-hover:bg-red-500' : 'bg-amber-400 group-hover:bg-amber-500'}`}
                                                style={{ height: getHeight(bufVal) }}
                                            ></div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* 3. Skill Level Availability */}
                <div className="bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 col-span-1 lg:col-span-3">
                    <h3 className="text-slate-800 font-bold text-sm mb-3">Skill Distribution</h3>
                    <div className="space-y-2">
                        {metrics.skills.map((skill) => (
                            <div key={skill.level} className={`p-2 rounded-lg border ${skill.color} transition-transform hover:-translate-y-0.5 duration-200`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{skill.level}</span>
                                    {skill.avail >= skill.req ? (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/50 rounded-md backdrop-blur-sm text-emerald-700">OK</span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/50 rounded-md backdrop-blur-sm text-red-700">Low</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] opacity-70 font-semibold uppercase">Avail</span>
                                        <span className="font-bold text-sm">{skill.avail}</span>
                                    </div>
                                    <div className="h-6 w-px bg-current opacity-20 mx-2"></div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] opacity-70 font-semibold uppercase">Req</span>
                                        <span className="font-bold text-sm">{skill.req}</span>
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