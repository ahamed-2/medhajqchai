
import React, { useState } from 'react';
import { Question } from '../types';
import { ArrowLeft, Key, GraduationCap, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

interface StudentLoginProps {
  onLogin: (subject: string) => void;
  questions: Question[];
  onBack: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, questions, onBack }) => {
  const [passkey, setPasskey] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = [...new Set(questions.map(q => q.subject))];

  const handleEnter = () => {
    if (passkey !== '1234') {
      Swal.fire('Access Denied', 'Invalid access passkey.', 'error');
      return;
    }
    if (!selectedSubject) {
      Swal.fire('Requirement', 'Please select a subject to proceed.', 'info');
      return;
    }
    onLogin(selectedSubject);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Portal</span>
        </button>

        <div className="glass-panel p-10 rounded-[40px] border-slate-800 shadow-2xl space-y-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-emerald-500/20 rounded-3xl mb-6 border border-emerald-500/50">
              <GraduationCap className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">Exam Hall Entry</h2>
            <p className="text-slate-400 mt-2">Enter your credentials to begin the exam session.</p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input 
                type="password"
                placeholder="Access Passkey (1234)" 
                className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Select Paper</label>
              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {subjects.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex justify-between items-center group ${
                        selectedSubject === sub 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-semibold">{sub}</span>
                      <ChevronRight size={18} className={`transition-transform ${selectedSubject === sub ? 'translate-x-1' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-800 text-slate-600">
                  No active exams available
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={!subjects.length}
            onClick={handleEnter}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-30"
          >
            Start Examination
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
