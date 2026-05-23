import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Database, Users, GitMerge, FileSpreadsheet, Map } from 'lucide-react';
import api from '../utils/api';

const UPLOAD_CONFIGS = [
    {
        id: 'linemaster',
        title: 'Line Master',
        icon: <GitMerge className="text-blue-500" size={24} />,
        endpoint: '/upload/linemaster',
        format: 'Plantcode | Line',
        desc: 'Replaces all production line definitions.'
    },
    {
        id: 'updstationmaster',
        title: 'UPD Station Master',
        icon: <Map className="text-indigo-500" size={24} />,
        endpoint: '/upload/updstationmaster',
        format: 'Plantcode | LINE | Station | stationtype',
        desc: 'Replaces all station mapping definitions.'
    },
    {
        id: 'departmentwiseskill',
        title: 'Department Wise Skill',
        icon: <Database className="text-emerald-500" size={24} />,
        endpoint: '/upload/departmentwiseskill',
        format: 'EmployeeGroup | Department Code | StationType | Shift | Skill | IndentManpower',
        desc: 'Replaces all station-level skill requirements.'
    },
    {
        id: 'headcountdataneemranaplant',
        title: 'Head Count Data',
        icon: <Users className="text-purple-500" size={24} />,
        endpoint: '/upload/headcount',
        format: 'Entity | Emp.ID | Employee Name | Gender | Division/Plant | Department | Section | Active / Left | Category | Date of Leaving | IsDojo | Dojo Certified Date | Date of Join | Shift',
        desc: 'Replaces the entire employee master roster.'
    },
    {
        id: 'employeemap',
        title: 'Employee Map',
        icon: <FileSpreadsheet className="text-amber-500" size={24} />,
        endpoint: '/upload/employeemap',
        format: 'PlantCode | EmployeeCode | Line/Machine | Station | StationType | Skill | Groupleader',
        desc: 'Replaces all line-worker assignments and skills.'
    }
];

const MasterUploadBox = ({ config }) => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
        }
    };

    const handleUpload = async () => {

        if (!file) return;
        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post(config.endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus({
                type: 'success',
                message: response.data.message,
                details: response.data.errors || []
            });
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            const errRes = error.response?.data;
            setStatus({
                type: 'error',
                message: errRes?.message || 'Failed to trigger upload.',
                details: errRes?.errors || []
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border text-left border-slate-200 shadow-sm rounded-xl p-5 flex flex-col transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-50 rounded-lg shrink-0">{config.icon}</div>
                <div>
                    <h3 className="font-bold text-slate-800 text-[15px] leading-tight">{config.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{config.desc}</p>
                </div>
            </div>
            <div className="bg-slate-50 rounded p-2 mb-4 border border-slate-100 shrink-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Expected Format Columns:</p>
                <code className="text-[10px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 block break-words">{config.format}</code>
            </div>
            <div className="mt-auto space-y-3">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" ref={fileInputRef} id={`file-upload-${config.id}`} />
                {status && (
                    <div className={`p-3 rounded-lg text-xs border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                        <div className="flex items-start gap-2">
                            {status.type === 'success' ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
                            <div>
                                <p className="font-semibold">{status.message}</p>
                                {status.details && status.details.length > 0 && (
                                    <ul className="mt-1 list-disc pl-4 space-y-0.5 opacity-80 max-h-20 overflow-y-auto pr-2">
                                        {status.details.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-2">
                    <button onClick={() => document.getElementById(`file-upload-${config.id}`).click()} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200">{file ? file.name : 'Choose Excel File'}</button>
                    <button onClick={handleUpload} disabled={!file || loading} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 min-w-[100px] ${(!file || loading) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md'}`}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : (<>
                            <UploadCloud size={14} />
                            Upload
                        </>)}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MasterUploadPage = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-6 pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-black text-slate-800">Master Data Import</h1>
                <p className="text-sm text-slate-500 mt-1">Upload bulk definitions directly to database master tables. <strong className="text-red-500">Warning:</strong> Running these imports will TRUNCATE and entirely replace the existing table's rows to guarantee a clean state. Make sure your Excel sheets are comprehensive.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
                {UPLOAD_CONFIGS.map(config => (
                    <MasterUploadBox key={config.id} config={config} />
                ))}
            </div>
        </div>
    );
};

export default MasterUploadPage;