import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const FilterContext = createContext();

export const useFilters = () => {
    return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
    // Selected Values
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedLine, setSelectedLine] = useState('');

    // Options
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [lines, setLines] = useState([]);

    const [loading, setLoading] = useState(true);

    // Fetch Options on Mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await api.get('/dashboard/filters');
                setDepartments(res.data.departments || []);
                setSections(res.data.sections || []);
                setLines(res.data.lines || []);
            } catch (error) {
                console.error("Failed to fetch filter options", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []);

    // Clear all filters
    const clearFilters = () => {
        setSelectedDept('');
        setSelectedSection('');
        setSelectedLine('');
    };

    const value = {
        selectedDept, setSelectedDept,
        selectedSection, setSelectedSection,
        selectedLine, setSelectedLine,
        departments,
        sections,
        lines,
        loading,
        clearFilters
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};
