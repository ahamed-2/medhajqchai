
import React from 'react';
import { View, AdminTab } from '../types';
import { LayoutDashboard, Database, Trophy, LogOut, Settings, BarChart3 } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <div className="w-72 glass-panel h-screen sticky top-0 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
          <LayoutDashboard className="text-slate-900" />
        </div>
        <h2 className="text-xl font-bold text-white">UP Admin</h2>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem icon={<BarChart3 />} label="Dashboard" active />
        <SidebarItem icon={<Database />} label="Question Bank" />
        <SidebarItem icon={<Trophy />} label="Result Sheets" />
        <SidebarItem icon={<Settings />} label="System Settings" />
      </nav>

      <button 
        onClick={onLogout}
        className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
      >
        <LogOut />
        <span className="font-semibold">Logout</span>
      </button>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default Sidebar;
