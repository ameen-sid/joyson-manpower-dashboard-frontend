import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const FilterContext = createContext();

export const useFilters = () => {
    return useContext(FilterContext);
};

const getOneMonthBeforeStr = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const FilterProvider = ({ children }) => {

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedShift, setSelectedShift] = useState('');

    const [startDate, setStartDate] = useState(() => getOneMonthBeforeStr());
    const [endDate, setEndDate] = useState(() => getTodayStr());

    const [departments, setDepartments] = useState([]);
    const [allSections, setAllSections] = useState([]);
    const [allLines, setAllLines] = useState([]);
    const [shifts, setShifts] = useState(['A', 'B', 'C', 'General']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            setLoading(true);
            try {
                const res = await api.get('/dashboard/filters');
                if (res.data.success) {
                    setDepartments(res.data.departments);
                    setAllSections(res.data.sections);
                    setAllLines(res.data.lines);
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

    const handleDeptChange = (dept) => {
        setSelectedDept(dept);
        setSelectedSection('');
        setSelectedLine('');
    };

    const handleSectionChange = (sect) => {
        setSelectedSection(sect);
        setSelectedLine('');
    };

    const clearFilters = () => {
        setSelectedDept('');
        setSelectedSection('');
        setSelectedLine('');
        setSelectedShift('');
        setStartDate(getOneMonthBeforeStr());
        setEndDate(getTodayStr());
    };

    const filteredSections = selectedDept 
        ? allSections.filter(s => s.department_name === selectedDept)
        : [];

    const filteredLines = (selectedDept && selectedSection)
        ? allLines.filter(l => l.department_name === selectedDept && l.section_name === selectedSection)
        : [];

    // Map objects to names for dropdowns
    const sectionNames = filteredSections.map(s => s.section_name);
    const lineNames = filteredLines.map(l => l.line_name);

    const value = {
        selectedDept, 
        setSelectedDept: handleDeptChange,
        selectedSection, 
        setSelectedSection: handleSectionChange,
        selectedLine, 
        setSelectedLine,
        selectedShift, 
        setSelectedShift,
        startDate, 
        setStartDate,
        endDate, 
        setEndDate,
        departments,
        sections: sectionNames,
        lines: lineNames,
        allSections,
        allLines,
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