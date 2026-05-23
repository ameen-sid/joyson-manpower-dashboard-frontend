import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';
import { Users, Filter, Award } from 'lucide-react';
import api from '../utils/api';
import { useFilters } from '../context/FilterContext';
import AttendanceUpload from './AttendanceUpload';
import SetRequiredManpower from './SetRequiredManpower';

const NoDataDisplay = ({ message = "No Data Available" }) => (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <div className="bg-slate-50 p-4 rounded-full mb-3">
            <Filter size={24} className="opacity-50" />
        </div>
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs opacity-70 mt-1">Try adjusting your filters</p>
    </div>
);

const Dashboard = () => {

    const { selectedDept, selectedSection, selectedLine, selectedShift, startDate, endDate } = useFilters();
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [isSetRequiredModalOpen, setIsSetRequiredModalOpen] = React.useState(false);

    const [metrics, setMetrics] = React.useState({
        workforce: 0,
        manpowerTrend: [],
        absenteeismTrend: [],
        attritionTrend: [],
        dojoTrend: [],
        skills: [],
        dojoCount: 0
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    department: selectedDept,
                    section: selectedSection,
                    line: selectedLine,
                    shift: selectedShift,
                    startDate,
                    endDate
                };

                const [manpowerRes, trendRes, absRes, skillsRes, attritionRes, dojoRes, dojoTrendRes] = await Promise.all([
                    api.get('/dashboard/stats/manpower', { params }),
                    api.get('/dashboard/stats/manpower-trend', { params }),
                    api.get('/dashboard/stats/absenteeism', { params }),
                    api.get('/dashboard/stats/skill-matrix', { params }),
                    api.get('/dashboard/stats/attrition', { params }),
                    api.get('/dashboard/stats/dojo', { params }),
                    api.get('/dashboard/stats/dojo-trend', { params })
                ]);

                const getSkillColor = (level) => {
                    switch (level) {
                        case 'L4': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
                        case 'L3': return 'border-blue-200 bg-blue-50 text-blue-700';
                        case 'L2': return 'border-indigo-200 bg-indigo-50 text-indigo-700';
                        case 'L1': return 'border-purple-200 bg-purple-50 text-purple-700';
                        default: return 'border-slate-200 bg-slate-50 text-slate-700';
                    }
                };

                setMetrics({
                    workforce: manpowerRes.data.actual,
                    manpowerTrend: trendRes.data,
                    absenteeismTrend: absRes.data,
                    attritionTrend: attritionRes.data,
                    dojoTrend: dojoTrendRes.data,
                    dojoCount: dojoRes.data.totalDojo,
                    skills: skillsRes.data.map(s => ({
                        level: s.skill,
                        avail: s.available,
                        req: s.required,
                        gap: s.gap,
                        color: getSkillColor(s.skill)
                    }))
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [selectedDept, selectedSection, selectedLine, selectedShift, startDate, endDate]);

    return (
        <div className="h-[calc(100vh-170px)] grid grid-rows-2 gap-3 animate-in fade-in duration-500 overflow-hidden relative">
            <div className="grid grid-cols-3 gap-3 h-full min-h-0">
                <div className="col-span-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-1 shrink-0">
                        <h3 className="text-sm font-bold text-slate-800">Total Manpower vs Actual vs Buffer</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setIsSetRequiredModalOpen(true)} className="bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5"><Users size={14} /> Set Required Manpower</button>
                            <button onClick={() => setIsUploadModalOpen(true)} className="bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload Attendance</button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 w-full">
                        {metrics.manpowerTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.manpowerTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                    <Line type="monotone" dataKey="total_required" name="Required" stroke="#3B82F6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="actual_available" name="Actual" stroke="#10B981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="buffer" name="Buffer" stroke="#F59E0B" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <NoDataDisplay />}
                    </div>
                </div>

                <div className="col-span-1 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 shrink-0">Skill Matrix</h3>
                    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                        {metrics.skills.length > 0 ? (
                            metrics.skills.map((skill) => (
                                <div key={skill.level} className={`p-2 rounded-lg border ${skill.color} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1 rounded-md bg-white/50 backdrop-blur-sm`}>
                                            <Award size={14} className="opacity-70" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[10px] sm:text-xs">{skill.level}</h4>
                                            <p className="text-[9px] sm:text-[10px] opacity-70">Gap: <span className={skill.gap < 0 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{skill.gap}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3 opacity-90">
                                        <div className="text-right">
                                            <p className="text-[8px] sm:text-[9px] opacity-60 uppercase font-semibold">Req</p>
                                            <p className="font-bold text-xs sm:text-sm">{skill.req}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] sm:text-[9px] opacity-60 uppercase font-semibold">Avail</p>
                                            <p className="font-bold text-xs sm:text-sm">{skill.avail}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : <NoDataDisplay message="No Skills Data" />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 h-full min-h-0">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 shrink-0">Absenteeism Trend</h3>
                    <div className="flex-1 min-h-0 w-full">
                        {metrics.absenteeismTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics.absenteeismTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="rate" name="Absenteeism %" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <NoDataDisplay />}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 shrink-0">Attrition Rate</h3>
                    <div className="flex-1 min-h-0 w-full">
                        {metrics.attritionTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.attritionTrend} barCategoryGap="20%">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                    <Bar dataKey="rate" name="Attrition %" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <NoDataDisplay />}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 shrink-0">Dojo Availability</h3>
                    <div className="flex-1 min-h-0 w-full">
                        {metrics.dojoTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.dojoTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                    <Bar dataKey="count" name="Available Dojo Manpower" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <NoDataDisplay />}
                    </div>
                </div>
            </div>

            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        <AttendanceUpload />
                    </div>
                </div>
            )}

            {isSetRequiredModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsSetRequiredModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        <SetRequiredManpower onClose={() => setIsSetRequiredModalOpen(false)} onSuccess={() => {
                            setIsSetRequiredModalOpen(false);
                            window.location.reload();
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;