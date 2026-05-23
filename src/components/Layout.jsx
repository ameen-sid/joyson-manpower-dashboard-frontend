
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, Calendar as CalendarIcon, RotateCcw, Activity } from 'lucide-react';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { useAuth } from '../context/AuthContext';

const SelectInput = ({ value, onChange, options, placeholder, className = "relative w-28 lg:w-32 xl:w-36 shrink-0" }) => (
    <div className={className}>
        <select value={value} onChange={onChange} className="appearance-none w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent block h-9 px-3 pr-8 shadow-sm transition-all hover:border-slate-600 cursor-pointer">
            <option value="">{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
    </div>
);

const DateInput = ({ value, onChange, label }) => (
    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 h-9 w-[105px] lg:w-[120px] shadow-sm transition-all hover:border-slate-600 shrink-0">
        <input type="date" value={value} onChange={onChange} className="bg-transparent text-slate-200 text-xs font-semibold outline-none w-full cursor-pointer" style={{ colorScheme: 'dark', }} />
    </div>
);

const LayoutContent = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        selectedDept, setSelectedDept,
        selectedSection, setSelectedSection,
        selectedLine, setSelectedLine,
        selectedShift, setSelectedShift,
        startDate, setStartDate,
        endDate, setEndDate,
        departments, sections, lines, shifts,
        clearFilters
    } = useFilters();

    const location = useLocation();
    const isUploadPage = location.pathname === '/upload';

    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const userMenuRef = React.useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
        };
        if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative">
            {!isUploadPage && (
                <>
                    <header className="sticky top-0 h-20 bg-slate-900 shadow-xl z-50 px-4 md:px-8 flex items-center justify-between relative shrink-0">
                        <div className="flex items-center space-x-3 md:space-x-4 z-10 shrink-0">
                            <div className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/50">
                                <img src="/logo.png" alt="Joyson logo" className="h-7 w-7 md:h-8 md:w-8 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-white tracking-wide leading-none">JOYSON</h1>
                                <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-widest uppercase">Safety Systems</p>
                            </div>
                            <div className="h-8 w-px bg-slate-700 mx-4 hidden lg:block"></div>
                        </div>
                        <div className="flex-1 hidden xl:flex items-center justify-center space-x-1.5 z-10 px-2 min-w-0">
                            <SelectInput value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} options={departments} placeholder="Department" />
                            <SelectInput value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} options={sections} placeholder="Section" />
                            <SelectInput value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} options={lines} placeholder="Line" />
                            <SelectInput value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} options={shifts} placeholder="Shift" />
                            <div className="flex items-center space-x-1 ml-1.5 shrink-0">
                                <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} label="From" />
                                <span className="text-slate-400 font-medium text-xs">to</span>
                                <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} label="To" />
                            </div>
                            <button onClick={clearFilters} className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all cursor-pointer" title="Reset Filters"><RotateCcw size={16} /></button>
                        </div>
                        <div className="relative z-10 shrink-0" ref={userMenuRef}>
                            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-3 pl-4 md:pl-6 border-l border-slate-700 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="text-sm text-right hidden lg:block">
                                    <div className="text-white font-semibold">Admin User</div>
                                    <div className="text-slate-400 text-xs">Administrator</div>
                                </div>
                                <div className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-slate-800">A</div>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 py-2 z-[9999]">
                                    <button onClick={() => { handleLogout(); setShowUserMenu(false); }} className="w-full px-4 py-2.5 text-left text-slate-200 hover:bg-slate-700 transition-colors flex items-center space-x-3 group">
                                        <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                                        <span className="font-medium group-hover:text-red-400 transition-colors">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                    <div className="xl:hidden bg-slate-900 px-4 py-3 flex items-center gap-2.5 overflow-x-auto z-10 border-t border-b border-slate-800 scrollbar-none">
                        <SelectInput value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} options={departments} placeholder="Dept" className="relative w-28 shrink-0" />
                        <SelectInput value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} options={sections} placeholder="Sect" className="relative w-28 shrink-0" />
                        <SelectInput value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} options={lines} placeholder="Line" className="relative w-28 shrink-0" />
                        <SelectInput value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} options={shifts} placeholder="Shift" className="relative w-24 shrink-0" />
                        <div className="flex items-center space-x-1 shrink-0">
                            <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} label="From" />
                            <span className="text-slate-400 font-medium text-xs px-1.5">to</span>
                            <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} label="To" />
                        </div>
                        <button onClick={clearFilters} className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all cursor-pointer shrink-0" title="Reset Filters"><RotateCcw size={16} /></button>
                    </div>
                </>
            )}
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