import { useState } from 'react';
import api from '../utils/api';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import * as xlsx from 'xlsx';

const AttendanceUpload = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
            setErrorList([]);
        }
    };

    const handleUpload = async () => {

        if (!file) {
            setMessage('Please select an Excel file to upload.');
            setSuccess(false);
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setMessage(null);
        setErrorList([]);
        try {

            const response = await api.post('/upload/attendance', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(true);
            setMessage(response.data.message);
            if (response.data.errors) {
                setErrorList(response.data.errors);
            }
            setFile(null);
        } catch (error) {
            setSuccess(false);
            setMessage(error.response?.data?.message || 'An error occurred during upload.');
            if (error.response?.data?.errors) {
                setErrorList(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {

        const wb = xlsx.utils.book_new();
        const wsData = [
            ['EmployeeCode', 'Date', 'Status'],
            ['EMP001', '2024-10-25', 'Present'],
            ['EMP002', '2024-10-25', 'Absent'],
            ['EMP003', '2024-10-25', 'Leave'],
            ['EMP004', '2024-10-25', 'HalfDay']
        ];
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(wb, ws, 'AttendanceTemplate');
        xlsx.writeFile(wb, 'Attendance_Template.xlsx');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Upload Daily Attendance</h3>
                <button onClick={downloadTemplate} className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                    <FileSpreadsheet size={16} />
                    <span>Download Template</span>
                </button>
            </div>

            <div className="mt-2 text-sm text-slate-500">
                <p>Upload an Excel file (.xlsx) containing attendance records. Columns must be exactly: <strong className="text-slate-700">EmployeeCode, Date, Status</strong>.</p>
                <p className="mt-1">Valid Statuses: Present, Absent, Leave, HalfDay.</p>
            </div>

            <div className="mt-4 border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <Upload className="text-slate-400 mb-3" size={32} />
                <label className="cursor-pointer">
                    <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Select Excel File</span>
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                </label>

                {file && (
                    <div className="mt-4 flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-sm border border-slate-200 w-full max-w-sm">
                        <span className="text-sm text-slate-700 truncate mr-3 flex-1">{file.name}</span>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500" title="Remove file"><X size={16} /></button>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end">
                <button onClick={handleUpload} disabled={!file || loading} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${!file || loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading Data...
                        </>
                    ) : (
                        'Upload Attendance'
                    )}
                </button>
            </div>

            {message && (
                <div className={`mt-4 p-4 rounded-lg flex flex-col gap-3 ${success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                    <div className="flex items-start gap-3">
                        {success ? (
                            <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
                        ) : (
                            <AlertCircle className="text-red-500 mt-0.5" size={20} />
                        )}
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${success ? 'text-emerald-800' : 'text-red-800'}`}>{message}</p>
                            {errorList.length > 0 && (
                                <div className="mt-3 bg-white/60 rounded p-3 text-xs text-red-700 font-mono overflow-y-auto max-h-32 border border-red-200/50">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {errorList.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceUpload;