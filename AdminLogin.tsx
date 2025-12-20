
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [key, setKey] = useState('');

  const handleLogin = () => {
    if (key === 'admin') {
      onLogin();
    } else {
      Swal.fire('Auth Failed', 'Incorrect administrative security key.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back Home</span>
        </button>

        <div className="glass-panel p-10 rounded-[40px] border-slate-800 shadow-2xl space-y-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-500/20 rounded-3xl mb-6 border border-blue-500/50">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold">Admin Portal</h2>
            <p className="text-slate-400 mt-2">Elevated access required. Please enter your secret key.</p>
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              type="password"
              placeholder="System Key (admin)" 
              className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-white placeholder-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all"
          >
            Authenticate Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
