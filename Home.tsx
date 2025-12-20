
import React from 'react';
import { View } from '../types';
import { GraduationCap, ShieldCheck, Code, Globe } from 'lucide-react';

interface HomeProps {
  setView: (v: View) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="inline-flex p-3 bg-cyan-500/20 rounded-2xl mb-4 border border-cyan-500/50">
          <GraduationCap className="w-12 h-12 text-cyan-400" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Ultra Pro Exam Portal
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          The most advanced, secure, and user-friendly online examination platform designed for modern education.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div 
            onClick={() => setView(View.AdminLogin)}
            className="glass-panel p-8 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group border-slate-700 hover:border-cyan-500/50"
          >
            <ShieldCheck className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-2">Admin Panel</h3>
            <p className="text-slate-400">Manage questions, monitor results, and access deep analytics.</p>
          </div>

          <div 
            onClick={() => setView(View.StudentLogin)}
            className="glass-panel p-8 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group border-slate-700 hover:border-emerald-500/50"
          >
            <GraduationCap className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-2">Student Panel</h3>
            <p className="text-slate-400">Join exams, view your history, and download certificates instantly.</p>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col items-center">
          <p className="text-slate-500 mb-4">Developed with excellence by</p>
          <div className="flex items-center gap-4 bg-slate-900/50 py-3 px-6 rounded-full border border-slate-800">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-slate-950">AR</div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-300">Ahamed Rahim</h4>
              <p className="text-xs text-slate-500">Full Stack Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
