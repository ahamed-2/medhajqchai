
import React, { useState } from 'react';
import { Question, Result } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, Database, Users, CheckCircle, Clock, Search, FileText, Wifi } from 'lucide-react';
import Swal from 'sweetalert2';

interface AdminDashboardProps {
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
  results: Result[];
  clearData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ questions, setQuestions, results, clearData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'results'>('overview');
  const [newQ, setNewQ] = useState<Partial<Question>>({
    subject: '',
    text: '',
    options: ['', '', '', ''],
    correct: '',
    duration: 25
  });
  const [bulkText, setBulkText] = useState('');

  const stats = {
    totalStudents: [...new Set(results.map(r => r.roll))].length,
    totalQuestions: questions.length,
    passRate: results.length ? Math.round((results.filter(r => r.passed).length / results.length) * 100) : 0,
    avgAccuracy: results.length ? (results.reduce((acc, r) => acc + (r.score / r.total), 0) / results.length * 100).toFixed(1) : 0
  };

  const chartData = [
    { name: 'Passed', value: results.filter(r => r.passed).length },
    { name: 'Failed', value: results.filter(r => !r.passed).length }
  ];

  const COLORS = ['#00cec9', '#ef4444'];

  const addQuestion = () => {
    if (!newQ.text || !newQ.subject || !newQ.correct || newQ.options?.some(o => !o)) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }
    const q: Question = {
      id: Date.now().toString(),
      subject: newQ.subject!,
      text: newQ.text!,
      options: newQ.options!,
      correct: newQ.correct!,
      duration: Number(newQ.duration) || 25
    };
    setQuestions([...questions, q]);
    setNewQ({ ...newQ, text: '', options: ['', '', '', ''], correct: '' });
    Swal.fire('Success', 'Question added to Cloud!', 'success');
  };

  const processBulk = () => {
    const lines = bulkText.trim().split('\n');
    const newQs: Question[] = [];
    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 5) {
        newQs.push({
          id: Math.random().toString(36).substr(2, 9),
          subject: newQ.subject || 'General',
          text: parts[0],
          options: [parts[1], parts[2], parts[3], parts[4]],
          correct: parts[1],
          duration: Number(newQ.duration) || 25
        });
      }
    });
    setQuestions([...questions, ...newQs]);
    setBulkText('');
    Swal.fire('Cloud Sync', `${newQs.length} questions uploaded.`, 'success');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">MongoDB Live Sync</span>
            </div>
          </div>
          <p className="text-slate-400">Connected to: cluster0.twjmzyo.mongodb.net</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {(['overview', 'questions', 'results'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users className="text-blue-400" />} label="Cloud Users" value={stats.totalStudents} />
            <StatCard icon={<Database className="text-cyan-400" />} label="Question Bank" value={stats.totalQuestions} />
            <StatCard icon={<CheckCircle className="text-emerald-400" />} label="Avg. Pass Rate" value={`${stats.passRate}%`} />
            <StatCard icon={<Wifi className="text-purple-400" />} label="Cloud Latency" value={`~42ms`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border-slate-800">
              <h3 className="text-xl font-semibold mb-8">Pass/Fail Distribution (Real-time)</h3>
              <div className="h-[300px]">
                {results.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                      <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 italic">Awaiting database entries...</div>
                )}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Database Utilities</h3>
              </div>
              <div className="space-y-4">
                <button onClick={clearData} className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group">
                  <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                  Wipe Cloud Database
                </button>
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(questions.map(q => q.subject))].map(s => (
                      <span key={s} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h3 className="text-xl font-semibold mb-4">Add Single Question</h3>
              <div className="space-y-4">
                <input placeholder="Subject" className="w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl" value={newQ.subject} onChange={e => setNewQ({...newQ, subject: e.target.value})} />
                <textarea placeholder="Question Text" className="w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl h-24" value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  {newQ.options?.map((opt, i) => (
                    <input key={i} placeholder={`Option ${String.fromCharCode(65+i)}`} className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm" value={opt} onChange={e => {
                      const opts = [...(newQ.options || [])];
                      opts[i] = e.target.value;
                      setNewQ({...newQ, options: opts});
                    }} />
                  ))}
                </div>
                <select className="w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-slate-400" value={newQ.correct} onChange={e => setNewQ({...newQ, correct: e.target.value})}>
                  <option value="">Select Correct Option</option>
                  {newQ.options?.map(opt => opt ? <option key={opt} value={opt} className="text-white">{opt}</option> : null)}
                </select>
                <button onClick={addQuestion} className="w-full bg-cyan-500 text-slate-950 font-bold p-4 rounded-xl hover:bg-cyan-400 transition-all">Upload to Cloud</button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h3 className="text-xl font-semibold mb-4">Bulk Cloud Upload</h3>
              <p className="text-xs text-slate-500 mb-4">Format: Question | Correct | Opt2 | Opt3 | Opt4</p>
              <textarea placeholder="Paste multiple lines here..." className="w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl h-40 font-mono text-xs" value={bulkText} onChange={e => setBulkText(e.target.value)} />
              <button onClick={processBulk} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold p-4 rounded-xl transition-all">Bulk Sync</button>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border-slate-800">
            <h3 className="text-xl font-semibold mb-6">Cloud Question Bank ({questions.length})</h3>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-cyan-500 mb-1 block">{q.subject}</span>
                      <h4 className="font-medium text-slate-200">{idx + 1}. {q.text}</h4>
                    </div>
                    <button onClick={() => deleteQuestion(q.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {q.options.map(opt => (
                      <div key={opt} className={`text-xs p-2 rounded-lg border ${opt === q.correct ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950/30 text-slate-500'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="glass-panel rounded-3xl overflow-hidden border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 text-sm border-b border-slate-800">
                  <th className="p-6">Roll No</th>
                  <th className="p-6">Student Name</th>
                  <th className="p-6">Subject</th>
                  <th className="p-6">Score</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {results.slice().reverse().map(r => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-mono text-cyan-400">{r.roll}</td>
                    <td className="p-6 font-semibold">{r.studentName}</td>
                    <td className="p-6 text-slate-400">{r.subject}</td>
                    <td className="p-6 font-bold">{r.score}/{r.total}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {r.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="p-6 text-slate-500 text-sm">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-cyan-500/30 transition-all">
    <div className="p-3 bg-white/5 w-fit rounded-2xl mb-4">{icon}</div>
    <p className="text-slate-400 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

export default AdminDashboard;
