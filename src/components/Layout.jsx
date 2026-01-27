import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Activity, Bell, ChevronDown } from 'lucide-react';
import { FilterProvider, useFilters } from '../context/FilterContext';

const SelectInput = ({ value, onChange, options, placeholder }) => (
    <div className="relative min-w-50">
        <select
            value={value}
            onChange={onChange}
            className="appearance-none w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent block py-2.5 px-4 pr-10 shadow-sm transition-all hover:border-slate-600 cursor-pointer font-medium"
        >
            <option value="">{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
);

const LayoutContent = () => {
    const navigate = useNavigate();
    const {
        selectedDept, setSelectedDept,
        selectedSection, setSelectedSection,
        selectedLine, setSelectedLine,
        departments, sections, lines,
        clearFilters
    } = useFilters();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative overflow-hidden">
            {/* Background Atmosphere (Subtle ties to Login Page) */}
            <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50/50 to-transparent pointer-events-none z-0"></div>

            {/* Top Header */}
            <header className="h-20 bg-slate-900 shadow-xl z-20 px-4 md:px-8 flex items-center justify-between relative overflow-hidden shrink-0">
                {/* Header Background Blobs (Matching Login Sidebar) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-40 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                {/* Left Side: Logo */}
                <div className="flex items-center space-x-3 md:space-x-4 z-10 shrink-0">
                    <div className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/50">
                        <Activity className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-white tracking-wide leading-none">
                            JOYSON
                        </h1>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-widest uppercase">Safety Systems</p>
                    </div>
                    {/* Divider hidden on small screens */}
                    <div className="h-8 w-px bg-slate-700 mx-4 hidden lg:block"></div>
                </div>

                {/* Middle: Global Filters (Hidden on very small screens or adaptable) */}
                <div className="flex-1 hidden md:flex items-center justify-center space-x-2 z-10 px-4">
                    <SelectInput
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        options={departments}
                        placeholder="Department"
                    />
                    <SelectInput
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        options={sections}
                        placeholder="Section"
                    />
                    <SelectInput
                        value={selectedLine}
                        onChange={(e) => setSelectedLine(e.target.value)}
                        options={lines}
                        placeholder="Line"
                    />
                    {(selectedDept || selectedSection || selectedLine) && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-red-400 hover:text-red-300 ml-2 px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Right Side: Account & Logout */}
                <div className="flex items-center space-x-4 md:space-x-6 z-10 shrink-0">
                    <div className="flex items-center space-x-3 pl-4 md:pl-6 border-l border-slate-700">
                        <div className="text-sm text-right hidden lg:block">
                            <div className="text-white font-semibold">Admin User</div>
                            <div className="text-slate-400 text-xs">Administrator</div>
                        </div>
                        <div className="h-9 w-9 md:h-10 md:w-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-slate-800">
                            A
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </header>

            {/* Mobile Filter Bar (Visible only on small screens) */}
            <div className="md:hidden bg-slate-800 p-3 flex gap-2 overflow-x-auto z-10 border-b border-slate-700">
                <SelectInput
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    options={departments}
                    placeholder="Dept"
                />
                <SelectInput
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    options={sections}
                    placeholder="Sect"
                />
                <SelectInput
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    options={lines}
                    placeholder="Line"
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8 z-10">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const Layout = () => (
    <FilterProvider>
        <LayoutContent />
    </FilterProvider>
);

export default Layout;