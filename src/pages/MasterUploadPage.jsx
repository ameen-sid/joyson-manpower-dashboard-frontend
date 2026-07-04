import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Database, Users, GitMerge, Map, X } from 'lucide-react';
import api from '../utils/api';

const UPLOAD_CONFIGS = [
    {
        id: 'departmentmaster',
        title: 'Department Master',
        icon: <Database className="text-blue-500" size={24} />,
        endpoint: '/upload/department-master',
        format: 'S. No | Department Name',
        desc: 'Upload departments. Only the Department Name column is saved.'
    },
    {
        id: 'sectionmaster',
        title: 'Section Master',
        icon: <GitMerge className="text-indigo-500" size={24} />,
        endpoint: '/upload/section-master',
        format: 'S. No | Section Name | Department Name',
        desc: 'Upload sections. Links sections to department using matched Department Name.'
    },
    {
        id: 'linemaster',
        title: 'Line Master',
        icon: <Map className="text-emerald-500" size={24} />,
        endpoint: '/upload/line-master',
        format: 'S. No | Line Name | Section Name | Department Name',
        desc: 'Upload production lines. Links lines to section & department using matched names.'
    },
    {
        id: 'employeemap',
        title: 'Employee Map',
        icon: <Users className="text-purple-500" size={24} />,
        endpoint: '/upload/employee-map',
        format: 'S. No | Employee ID | Employee Name | Employee Code | Gender | Line Name | Section Name | Department Name | Shift | Skill | Active/Left | Category | Date of Joining | Date of Leaving | isDojo',
        desc: 'Upload employee master roster. Auto-links line, section, and department IDs using matched names.'
    }
];

const ResultModal = ({ isOpen, onClose, data, title }) => {
    if (!isOpen || !data) return null;

    const { summary, successRows = [], failedRows = [], message } = data;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{title} Upload Results</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Summary of processed excel rows</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Summary Badges */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-xl font-black text-slate-700 mt-1">{summary?.total || 0}</div>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center shadow-sm">
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Uploaded</div>
                        <div className="text-xl font-black text-emerald-700 mt-1">{summary?.success || 0}</div>
                    </div>
                    <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-center shadow-sm">
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Failed</div>
                        <div className="text-xl font-black text-red-700 mt-1">{summary?.failed || 0}</div>
                    </div>
                </div>

                {/* Alert message banner */}
                {message && (
                    <div className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold border ${
                        failedRows.length > 0 
                            ? 'bg-red-50 border-red-100 text-red-800' 
                            : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Body Details */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Failed Rows Section */}
                    {failedRows.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                <h4 className="font-bold text-red-700 text-sm">Failed / Skipped Rows ({failedRows.length})</h4>
                            </div>
                            <div className="border border-red-100 rounded-xl overflow-hidden divide-y divide-red-50 max-h-52 overflow-y-auto shadow-inner bg-red-50/5">
                                {failedRows.map((item, idx) => (
                                    <div key={idx} className="p-3 text-xs flex justify-between items-start gap-4">
                                        <div className="font-semibold text-slate-700 shrink-0">Row {item.row} ({item.name})</div>
                                        <div className="text-red-600 font-medium text-right leading-snug">{item.error}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Success Rows Section */}
                    {successRows.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <h4 className="font-bold text-emerald-700 text-sm">Successfully Uploaded Rows ({successRows.length})</h4>
                            </div>
                            <div className="border border-emerald-100 rounded-xl overflow-hidden divide-y divide-emerald-50 max-h-52 overflow-y-auto shadow-inner bg-emerald-50/5">
                                {successRows.map((item, idx) => (
                                    <div key={idx} className="p-3 text-xs flex justify-between items-center gap-4">
                                        <div className="font-semibold text-slate-700">Row {item.row} ({item.name})</div>
                                        <div className="text-emerald-600 font-medium">{item.message || 'Success'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
};

const MasterUploadBox = ({ config, onResult }) => {
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

            onResult(response.data);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            const errRes = error.response?.data;
            if (errRes && (errRes.successRows || errRes.failedRows)) {
                onResult(errRes);
            } else {
                setStatus({
                    type: 'error',
                    message: errRes?.message || 'Failed to trigger upload.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border text-left border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shrink-0">{config.icon}</div>
                <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-tight">{config.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{config.desc}</p>
                </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 mb-5 border border-slate-100 shrink-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Required Excel Format Columns:</p>
                <code className="text-[10px] text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 block break-words leading-relaxed font-mono font-medium">{config.format}</code>
            </div>
            <div className="mt-auto space-y-3">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" ref={fileInputRef} id={`file-upload-${config.id}`} />
                {status && (
                    <div className="p-3 rounded-xl text-xs border bg-red-50 border-red-100 text-red-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold">{status.message}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-2.5">
                    <button onClick={() => document.getElementById(`file-upload-${config.id}`).click()} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200 truncate cursor-pointer">{file ? file.name : 'Choose Excel File'}</button>
                    <button onClick={handleUpload} disabled={!file || loading} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 min-w-[110px] cursor-pointer ${(!file || loading) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'}`}>
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
    const [resultData, setResultData] = useState(null);
    const [resultTitle, setResultTitle] = useState('');

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="mb-6 pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-black text-slate-950">Master Data Import</h1>
                <p className="text-sm text-slate-500 mt-1">Upload your plant hierarchy and employee map using standard Excel sheets. System verifies name matches and reports issues.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {UPLOAD_CONFIGS.map(config => (
                    <MasterUploadBox key={config.id} config={config} onResult={(data) => {
                        setResultData(data);
                        setResultTitle(config.title);
                    }} />
                ))}
            </div>
            <ResultModal isOpen={!!resultData} onClose={() => setResultData(null)} data={resultData} title={resultTitle} />
        </div>
    );
};

export default MasterUploadPage;