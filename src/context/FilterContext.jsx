import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const FilterContext = createContext();

export const useFilters = () => {
    return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedShift, setSelectedShift] = useState('');

    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [lines, setLines] = useState([]);
    const [shifts, setShifts] = useState(['A', 'B', 'C', 'General']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            setLoading(true);
            try {
                const res = await api.get('/dashboard/filters');
                if (res.data.success) {
                    setDepartments(res.data.departments);
                    setSections(res.data.sections);
                    setLines(res.data.lines);
                    setShifts(res.data.shifts || ['A', 'B', 'C', 'General']);
                }
            } catch (error) {
                console.error("Failed to load filters", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilters();
    }, []);

    const clearFilters = () => {
        setSelectedDept('');
        setSelectedSection('');
        setSelectedLine('');
        setSelectedShift('');

        const end = new Date();
        const start = new Date();
        start.setDate(1);

        setEndDate(end.toISOString().split('T')[0]);
        setStartDate(start.toISOString().split('T')[0]);
    };

    const value = {
        selectedDept, setSelectedDept,
        selectedSection, setSelectedSection,
        selectedLine, setSelectedLine,
        selectedShift, setSelectedShift,
        startDate, setStartDate,
        endDate, setEndDate,
        departments,
        sections,
        lines,
        shifts,
        loading,
        clearFilters
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};