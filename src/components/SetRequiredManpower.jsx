import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useFilters } from '../context/FilterContext';

const SetRequiredManpower = ({ onClose, onSuccess }) => {

    const { selectedDept, selectedSection, selectedLine, selectedShift, endDate, departments, allSections, allLines, shifts } = useFilters();
    const [date, setDate] = useState(endDate || new Date().toISOString().split('T')[0]);
    const [dept, setDept] = useState(selectedDept || '');
    const [section, setSection] = useState(selectedSection || '');
    const [line, setLine] = useState(selectedLine || '');
    const [shift, setShift] = useState(selectedShift || '');

    const handleDeptChange = (val) => {
        setDept(val);
        setSection('');
        setLine('');
    };

    const handleSectionChange = (val) => {
        setSection(val);
        setLine('');
    };

    const modalSections = dept 
        ? allSections.filter(s => s.department_name === dept).map(s => s.section_name)
        : [];

    const modalLines = (dept && section)
        ? allLines.filter(l => l.department_name === dept && l.section_name === section).map(l => l.line_name)
        : [];

    const [levels, setLevels] = useState({
        l0: 0,
        l1: 0,
        l2: 0,
        l3: 0,
        l4: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalCalculated = Number(levels.l0) + Number(levels.l1) + Number(levels.l2) + Number(levels.l3) + Number(levels.l4);

    const handleLevelChange = (level, val) => {
        setLevels(prev => ({
            ...prev,
            [level]: parseInt(val) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!date) {
            setError('Please provide a target date.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                date,
                department: dept,
                section: section,
                line: line,
                shift: shift,
                req_l0: levels.l0,
                req_l1: levels.l1,
                req_l2: levels.l2,
                req_l3: levels.l3,
                req_l4: levels.l4
            };

            const response = await api.post('/dashboard/required-manpower', payload);
            if (response.data.success) {
                onSuccess();
            } else {
                setError(response.data.message || 'Failed to update required manpower.');
            }
        } catch (err) {
            console.error('Error saving required manpower', err);
            setError('An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    const isFormInvalid = !date;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Set Required Manpower</h2>
            <p className="text-sm text-slate-500 mb-6">Define the required manpower for the currently selected filters.</p>
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                        <select value={dept} onChange={(e) => handleDeptChange(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white">
                            <option value="">All</option>
                            {departments?.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                        <select disabled={!dept} value={section} onChange={(e) => handleSectionChange(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white disabled:bg-slate-100 disabled:cursor-not-allowed">
                            <option value="">All</option>
                            {modalSections?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Line</label>
                        <select disabled={!section} value={line} onChange={(e) => setLine(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white disabled:bg-slate-100 disabled:cursor-not-allowed">
                            <option value="">All</option>
                            {modalLines?.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Shift</label>
                        <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white">
                            <option value="">All</option>
                            {shifts?.map(sf => <option key={sf} value={sf}>{sf}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Target Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Skill Level Requirements</label>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            Total: {totalCalculated}
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {['l0', 'l1', 'l2', 'l3', 'l4'].map((lvl) => (
                            <div key={lvl}>
                                <label className="block text-xs font-bold text-slate-500 mb-1 text-center uppercase">{lvl}</label>
                                <input type="number" min="0" value={levels[lvl]} onChange={(e) => handleLevelChange(lvl, e.target.value)} className="w-full px-2 py-1.5 text-center text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent">Cancel</button>
                    <button type="submit" disabled={loading || isFormInvalid} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition-all flex items-center justify-center min-w-[100px]">{loading ? 'Saving...' : 'Save Config'}</button>
                </div>
            </form>
        </div>
    );
};

export default SetRequiredManpower;